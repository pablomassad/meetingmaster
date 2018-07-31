import { Injectable } from '@angular/core'
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore'

import 'rxjs/add/operator/map'
import * as firebase from 'firebase/app'
import {Observable} from 'rxjs/Rx'


@Injectable()
export class FirebaseService {

   usersRef: AngularFirestoreCollection<any>

   constructor(
      private afs: AngularFirestore
   ) {
      console.log('FirebaseService constructor')
      this.usersRef = this.afs.collection('users')
   }

   
   ///////////////////////////////////////////////
   // USUARIOS
   ///////////////////////////////////////////////
   getCommunity():Observable<any[]>{
      this.usersRef = this.afs.collection('users')
      return this.usersRef.valueChanges()
   }
   getUserById(uid){
      const uref = this.usersRef.doc(uid)
      const obs = uref.valueChanges()
      return obs
   }
   addUser(usr) {
      const ref = this.usersRef.doc(usr.uid).set(usr)
      return ref;
   }
   updateUser(usr):Promise<void> {
      // const ref = this.afs.collection('users').doc(usr.uid).set(usr, { merge: true })
      const ref = this.usersRef.doc(usr.uid).set(usr)
      return ref
   }


   ///////////////////////////////////////////////
   // EVENTOS
   ///////////////////////////////////////////////   
   getEventsByUid(uid) {
      const field: string = 'members.' + uid
      const ref = this.afs.collection('events', ref => ref.where(field, '==', true))
      const obs = ref.snapshotChanges().map(actions =>{
         return actions.map(item => {
            const data = item.payload.doc.data()
            const id = item.payload.doc.id
            const  o = { id, ...data }
            return o
         })
      })
      return obs
   }
   saveEvent(evt) {
      evt.modificationDate = new Date().getTime()
      if (!evt.id){
         if (evt.members[evt.owner]!=true)
            evt.members[evt.owner]=true
         evt.creationDate = new Date().getTime()
         this.afs.collection('events').add(evt)
      }
      else
         this.afs.collection('events').doc(evt.id).set(evt)
   }
   deleteEvent(evt){
      const ref = this.afs.collection('events').doc(evt.id).delete()
      return ref
   }


   ///////////////////////////////////////////////
   // COMENTARIOS
   ///////////////////////////////////////////////
   getCommentsByEvtId(eid){
      const ref = this.afs.collection('events').doc(eid).collection('comments', ref => ref.orderBy('creationDate', 'asc') )
      const obs = ref.snapshotChanges().map(actions =>{
         return actions.map(item => {
            const data = item.payload.doc.data()
            const id = item.payload.doc.id
            const  o = { id, ...data }
            return o
         })
      })
      return obs
   }
   saveComment(eid, comment) {
      if (!comment.id){
         this.afs.collection('events').doc(eid).collection('comments').add(comment)
      }
      else
         this.afs.collection('events').doc(eid).collection('comments').doc(comment.id).set(comment)
   }
   deleteComment(eid, comment){
      this.afs.collection('events').doc(eid).collection('comments').doc(comment.id).delete()
   }


   ///////////////////////////////////////////////
   // SUGERENCIAS
   ///////////////////////////////////////////////
   getSuggestions(){
      const ref = this.afs.collection('suggestions', ref => ref.orderBy('creationDate', 'asc') )
      const obs = ref.snapshotChanges().map(actions =>{
         return actions.map(item => {
            const data = item.payload.doc.data()
            const id = item.payload.doc.id
            const  o = { id, ...data }
            return o
         })
      })
      return obs
   }
   saveSuggestion(sug) {
      if (!sug.id){
         this.afs.collection('suggestions').add(sug)
      }
      else
         this.afs.collection('suggestions').doc(sug.id).set(sug)
   }
   deleteSuggestion(sug){
      this.afs.collection('suggestions').doc(sug.id).delete()
   }


   ///////////////////////////////////////////////
   // Descarga de APP
   ///////////////////////////////////////////////
   download(filename) {
      // Create a reference with an initial file path and name
      const st = firebase.storage();
      const pathReference = st.ref(filename);
      const refGS = st.refFromURL('gs://events-12be3.appspot.com/'+filename)
      refGS.getDownloadURL().then(function (url) {
         window.open(url, '_system')
      }).catch(function (error) {
         switch (error.code) {
            case 'storage/object_not_found':
               this.appSrv.message('No se ha encontrado el archivo!')
               break;

            case 'storage/unauthorized':
               this.appSrv.message('No tiene permiso para bajar el archivo!')
               break;

            case 'storage/canceled':
               this.appSrv.message('Se ha cancelado la descarga!')
               break;

            case 'storage/unknown':
               this.appSrv.message('Ha ocurrido un error desconocido!')
               break;
         }
      });
   }
}
