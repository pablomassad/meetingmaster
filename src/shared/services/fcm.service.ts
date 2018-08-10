import { Injectable } from '@angular/core'
import { Platform } from 'ionic-angular'
import { Firebase } from '@ionic-native/firebase'
import { FirebaseService } from '../services/firebase.service'

@Injectable()
export class FCMService {
   userName: string = 'test User'


   constructor(
      private firebaseNative: Firebase,
      private platform: Platform,
      private fs: FirebaseService
   ) {
      console.log('FCMService constructor');
   }
   initFCM(userName: string) {
      this.userName = userName
   }
   async getToken() {
      let token
      if (this.platform.is('android')) {
         token = await this.firebaseNative.getToken()
      }
      return this.saveTokenToFirebase(token)
   }
   subscribeTopic(topic: string) {
      this.firebaseNative.subscribe(topic)
   }
   listenOnNotification(){
      return this.firebaseNative.onNotificationOpen() 
   }

   private saveTokenToFirebase(token) {
      // if (!token) return
      // const devicesRef = this.fs.afs.collection('tokens')
      // const docData = {
      //    token,
      //    userId: this.userName
      // }
      // console.log('token data: ', docData)
      // return devicesRef.doc(token).set(docData)
   }
}
