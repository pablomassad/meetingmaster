import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable'

import { FirebaseService } from '../../shared/services/firebase.service';


@IonicPage()
@Component({
   selector: 'page-contacts',
   templateUrl: 'contacts.html'
})
export class ContactsPage implements OnInit, OnDestroy {
   title:string
   user:any
   userObs:Observable<any>
   community:Observable<any[]>
   searchText: string
   sortField: string = 'creationDate'
   direction:boolean = false
   phoneContacts:any[] = []
   selPhotoUrl:SafeUrl
   private uid:string

   constructor(
      private navParams: NavParams,
      private view: ViewController,
      private fs: FirebaseService,
      private sanitizer: DomSanitizer
   ) {
      console.log('ContactsPage constructor')
      this.title = this.navParams.get('title')
      this.uid = this.navParams.get('uid')
   }
   ngOnDestroy() {
      console.warn('ContactsPage destroy');
   }
   ngOnInit(): void {
      console.log('ContactsPage init');
      this.community = this.fs.getCommunity()
      this.userObs = this.fs.getUserById(this.uid)
      this.userObs.subscribe(o=>{
         this.user = o
      })
   }
   selChanged(ev, ct){
      if (ev.checked == true){
         this.user.contacts[ct.uid] = true
      }
      else{
         delete this.user.contacts[ct.uid]
      }
      this.fs.updateUser(this.user)
   }
   initContacts(ct){
      const res = this.user.contacts[ct.uid] == true
      return res
   }
   getSortedContacts(sort, fab){
      this.sortField = sort
      this.direction = !this.direction
      fab.close()
   }   
   getSortName(){
      if (this.sortField === "displayName")
         return "Persona"
      else
         return "Miembros"
   }   
   getIcon(){
      if (this.direction === true)
         return "arrow-dropdown"
      else 
         return "arrow-dropup"
   }   
   showSelPhoto(ct){
      this.selPhotoUrl = this.getPhoto(ct)
   }
   getPhoto(ct){
      let res:SafeUrl = ""
      
      if(ct.photos != null) {
         console.log(ct.photos);
         res = this.sanitizer.bypassSecurityTrustUrl(ct.photos[0].value);
         console.log(ct);
       } else {
         res = "assets/imgs/person.png";
       }
      return res
   }
   getPhone(ct){
      let res:string = ""
      if (ct.phoneNumbers)
         res = ct.phoneNumbers[0].value
      return res
   }
   closeModal(){
      this.view.dismiss(null)
   }
}
