import { Component, OnInit, OnDestroy, NgZone, ViewChild } from '@angular/core'
import { Platform, NavController } from 'ionic-angular'
import { AngularFirestore } from 'angularfire2/firestore'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { CodePush, SyncStatus } from '@ionic-native/code-push'
import { ApplicationService, GlobalService, NetworkService } from 'fwk-services'


@Component({
   templateUrl: 'app.html'
})
export class MeetingApp implements OnInit, OnDestroy {
   @ViewChild('content') nav: NavController
   prog: number = 0
   showProgressBar: boolean = false

   constructor(
      private globalSrv: GlobalService,
      private zone: NgZone,
      private codePush: CodePush,
      private afs: AngularFirestore,
      private appSrv: ApplicationService,
      private netSrv: NetworkService,
      private platform: Platform,
      private statusBar: StatusBar,
      private splashScreen: SplashScreen
   ) {
      console.log('MeetingApp constructor');
      this.afs.firestore.settings({ timestampsInSnapshots: true })
      this.afs.firestore.enablePersistence()

      this.platform.ready().then(() => {
         console.log('platform ready....')
         if (this.netSrv.networkStatus == true) {
            console.log('starting update validation......')
            this.codePush.sync({}, (progress) => {
               this.zone.run(() => {
                  this.prog = Math.floor(progress.receivedBytes / progress.totalBytes * 100)
               })
            }).subscribe(status => {
               switch (status) {
                  case SyncStatus.CHECKING_FOR_UPDATE:
                     console.log('CHECKING_FOR_UPDATE: ', SyncStatus.CHECKING_FOR_UPDATE)
                     //this.appSrv.message('Buscando actualizacion...', '')
                     break;
                  case SyncStatus.AWAITING_USER_ACTION:
                     console.log('AWAITING_USER_ACTION: ', SyncStatus.AWAITING_USER_ACTION)
                     this.appSrv.basicAlert('Aviso', 'Espera de usuario')
                     break;
                  case SyncStatus.IN_PROGRESS:
                     console.log('IN_PROGRESS: ', SyncStatus.IN_PROGRESS)
                     //this.appSrv.message('Actualizando...')
                     break;
                  case SyncStatus.DOWNLOADING_PACKAGE:
                     console.log('DOWNLOADING_PACKAGE: ', SyncStatus.DOWNLOADING_PACKAGE)
                     //this.appSrv.message('Bajando actualizacion...')
                     this.zone.run(() => {
                        this.showProgressBar = true
                        console.log('showProgressBar: ', this.showProgressBar)
                     })
                     break;
                  case SyncStatus.UP_TO_DATE:
                     console.log('UP_TO_DATE: ', SyncStatus.UP_TO_DATE)
                     this.appSrv.message('Aplicacion actualizada')
                     break;
                  case SyncStatus.INSTALLING_UPDATE:
                     console.log('INSTALLING_UPDATE: ', SyncStatus.INSTALLING_UPDATE)
                     //this.appSrv.message('Instalando actualizacion...')
                     break;
                  case SyncStatus.UPDATE_IGNORED:
                     console.log('UPDATE_IGNORED: ', SyncStatus.UPDATE_IGNORED)
                     //this.appSrv.message('Actualizacion ignorada')
                     break;
                  case SyncStatus.UPDATE_INSTALLED:
                     console.log('UPDATE_INSTALLED: ', SyncStatus.UPDATE_INSTALLED)
                     this.codePush.restartApplication();
                  //this.appSrv.basicAlert('Aviso', 'Actualizacion instalada, reinicie app!')
                  case SyncStatus.ERROR:
                     this.appSrv.message('SyncStatus.ERROR....')
                     console.log('SyncStatus.ERROR: ', SyncStatus.ERROR)
                     break;
               }
            })
         }
         this.statusBar.styleLightContent()
         this.splashScreen.hide()
      }).catch(err => {
         console.error(err)
         this.appSrv.message(err, 'Error!')
      })
   }

   ngOnDestroy() {
      console.warn('MeetingApp destroy');
   }
   ngOnInit(): void {
      console.log('MeetingApp init')
      this.nav.setRoot('LoginPage')
   }
   logout() {
      this.globalSrv.save('user', null)
      this.nav.setRoot('LoginPage')
   }
}

