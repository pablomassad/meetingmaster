import { Component, OnInit, OnDestroy } from '@angular/core'
import { NavController, IonicPage, NavParams, ActionSheetController, ModalController, Modal, Platform, AlertController } from 'ionic-angular'
import { OneSignal } from '@ionic-native/onesignal'
import { ApplicationService, GlobalService } from 'fwk-services'
import { AuthService } from 'fwk-auth';

import { ENVIRONMENTS } from '../../environments'

import { FirebaseService } from '../../shared/services/firebase.service';
import { HttpClient } from '@angular/common/http'
import { Subscription } from 'rxjs';

@IonicPage()
@Component({
   selector: 'page-home',
   templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {
   idevt: string
   title: string = "Meeting Master"
   user: any
   community: any[]
   contactsFull: any[]
   events: any
   photoPath: string
   today: number = new Date().getTime()
   searchText: string
   sortField: string = 'creationDate'
   direction: boolean = false
   private subNotify: Subscription
   private subEvt: Subscription
   private subCom: Subscription

   constructor(
      private oneSignal: OneSignal,
      private platform:Platform,
      private alertCtrl: AlertController,
      private navCtrl: NavController,
      private navParams: NavParams,
      private actionCtrl: ActionSheetController,
      private appSrv: ApplicationService,
      private globalSrv: GlobalService,
      private authSrv: AuthService,
      private modal: ModalController,
      private http: HttpClient,
      private fs: FirebaseService
   ) {
      console.log('HomePage contructor')
      this.user = this.navParams.get('usr')
   }

   ngOnInit() {
      console.log('HomePage init')

      const plataforma = this.globalSrv.getVar('plataforma')
      if (plataforma == "mobile") {
         this.oneSignal.setLogLevel({ logLevel: 1, visualLevel: 1 })
         const firebaseConfig = ENVIRONMENTS.firebase   
         const oneSignalId = ENVIRONMENTS.oneSignalId
         //this.oneSignal.startInit('994ca981-ece6-48b8-bc11-154ec73066db', '966739792993')
         this.oneSignal.startInit(oneSignalId, firebaseConfig.messagingSenderId)

         this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None)
         //this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert)

         this.oneSignal.handleNotificationReceived().subscribe((x) => {
            this.appSrv.basicAlert(JSON.stringify(x))
         })
         this.oneSignal.handleNotificationOpened().subscribe((x) => {
            this.appSrv.basicAlert(JSON.stringify(x))
         })
         this.oneSignal.endInit();
         this.oneSignal.sendTag('legajo', this.user.legajo)
         this.oneSignal.getIds().then(x => { //x.userId: id de app cliente  -  x.pushToken: random chars
            console.log(JSON.stringify(x))
         })
      }  
      this.notifyMemberInEvent(this.user.uid)
      this.subEvt = this.fs.getEventsByUid(this.user.uid).subscribe(data => {
         this.events = data
      })
      //this.appSrv.showLoading()
      this.subCom = this.fs.getCommunity().subscribe(data => {
         this.community = data
         this.contactsFull = this.getContactsFull()
         //this.appSrv.hideLoading()
      })
      console.log('subEvt: ', this.subEvt.closed)
      console.log('subCom: ', this.subCom.closed)
   }
   ngOnDestroy() {
      console.log('HomePage destroy')
      if (this.subCom) this.subCom.unsubscribe()
      if (this.subEvt) this.subEvt.unsubscribe()
      if (this.subNotify) this.subNotify.unsubscribe()
   }
   showUserInfo() {
      this.appSrv.message('Usuario logueado: ', this.user.displayName)
   }
   doRefresh(refresher) {
      console.log('Begin async operation', refresher);

      setTimeout(() => {
         console.log('Async operation has ended');
         refresher.complete();
      }, 2000);
   }
   addEvent() {
      this.showEditEvent('Nuevo Evento', { members: [] })
   }
   editEvent(ev, i) {
      this.showEditEvent('Editar Evento', ev)
   }
   showEvent(ev, i) {
      this.navCtrl.push('EventPage', {
         title: 'Evento',
         evt: ev,
         user: this.user,
         membersFull: this.getMembersFull(ev)
      })
   }
   removeEvent(ev, i) {
      let alert = this.alertCtrl.create({
         title: 'Aviso',
         message: 'Esta seguro de eliminar este evento?',
         buttons: [
            {
               text: 'No',
               role: 'cancel',
               handler: () => {
               }
            },
            {
               text: 'Si',
               handler: () => {
                  if (ev.owner === this.user.uid)
                     this.fs.deleteEvent(ev)
                  else {
                     ev.members[this.user.uid] = false
                     this.fs.updateUser(ev)
                  }
               }
            }
         ]
      })
      alert.present()
   }
   openMenuSheet() {
      let actionSheet = this.actionCtrl.create({
         title: 'OPCIONES:',
         cssClass: 'action-sheets-basic-page',
         buttons: [
            // {
            //    text: 'Contactos',
            //    handler: () => {
            //       console.log('Contacts Admin');
            //       this.navCtrl.push('ContactsPage', {
            //          title: 'Contactos',
            //          uid: this.user.uid
            //       })
            //    }
            // },
            {
               text: 'Sugerencias',
               handler: () => {
                  console.log('Suggestions');
                  this.navCtrl.push('SuggestionsPage', {
                     title: 'Sugerencias',
                     user: this.user
                  })
               }
            },
            {
               text: 'Bajar App',
               handler: () => {
                  console.log('Download App!!!');
                  window.open('https://firebasestorage.googleapis.com/v0/b/events-12be3.appspot.com/o/MeetingMaster.apk?alt=media&token=66af8eb0-463c-44ed-a596-5a7b21ff5d8a', '_system')
               }
            },
            {
               text: 'Salir',
               handler: () => {
                  console.log('Logout!!!');
                  this.logout();
               }
            }, {
               text: 'Cancelar',
               role: 'cancel',
               handler: () => {
                  console.log('Cancel clicked');
               }
            }
         ]
      });
      actionSheet.present();
   }
   evalTypeIcon(t) {
      let src = ""
      switch (t) {
         case "calendario":
            src = "assets/imgs/cal.png"
            break;
         case "seleccion":
            src = "assets/imgs/seleccion.png"
            break;
         case "votacion":
            src = "assets/imgs/votacion.png"
            break;
         default:
            break;
      }
      return src
   }
   getSortedEvents(sort, fab) {
      this.sortField = sort
      this.direction = !this.direction
      fab.close()
   }
   getSortName() {
      if (this.sortField === "creationDate")
         return "Fecha"
      else
         return "Evento"
   }
   getIcon() {
      if (this.direction === true)
         return "arrow-dropdown"
      else
         return "arrow-dropup"
   }


   private notifyMemberInEvent(uid) {
      try {
         if (!idEvtParam) return
         this.subNotify = this.http.get<any>('https://us-central1-events-12be3.cloudfunctions.net/notifyMember/' + idEvtParam + '/' + uid)
            .subscribe(o => {
               console.log('Notify ok: ', o)
            })
      } catch (error) {
         console.log(error)
      }
   }
   private showEditEvent(tit, ev) {
      const mod: Modal = this.modal.create('EditEventPage', {
         title: tit,
         evt: ev,
         user: this.user,
         contactsFull: this.contactsFull
      }, {})
      mod.present()
      mod.onDidDismiss(data => {
      })
   }
   private getContactsFull() {
      const lst: any = []
      if (this.user.contacts) {
         this.community.forEach(p => {
            const sel = (this.user.contacts[p.uid])
            if (sel == true) {
               lst.push(p)
            }
         });
      }
      return lst
   }
   private getMembersFull(ev) {
      const lst: any = []
      if (ev.members) {
         Object.keys(ev.members).forEach(m => {
            const mem = this.community.find(c => c.uid == m)
            if (mem)
               lst.push(mem)
         })
         // this.community.forEach(p => {
         //    const sel = (ev.members[p.uid])
         //    if (sel == true) {
         //       lst.push(p)
         //    }
         // });
      }
      return lst
   }
   private logout() {
      this.appSrv.message('Saliendo...');
      this.authSrv.signOutUser();
      this.navCtrl.setRoot('LoginPage');
   }
}
