import { NgModule, ErrorHandler } from '@angular/core'
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { SplashScreen } from '@ionic-native/splash-screen'
import { StatusBar } from '@ionic-native/status-bar'
import { Network } from '@ionic-native/network'

import { HttpClientModule } from '@angular/common/http'

import { CodePush } from '@ionic-native/code-push'

import { MeetingApp } from './app.component'
import { SharedModule } from '../shared/shared.module'

import 'firebase/storage'; 
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFireModule } from 'angularfire2'
import { AngularFirestoreModule } from 'angularfire2/firestore'
import { FirebaseService } from '../shared/services/firebase.service'
import { Firebase } from '@ionic-native/firebase'

import { FwkServicesModule, ApplicationService, GlobalService, NetworkService, ProgressBarComponent } from 'fwk-services';
import { FwkAuthModule, AuthService } from 'fwk-auth'
import { ENVIRONMENTS } from '../environments';



@NgModule({
   declarations: [
      MeetingApp
   ],
   imports: [
      FwkAuthModule,
      HttpClientModule,
      FwkServicesModule,
      BrowserModule,
      BrowserAnimationsModule,
      IonicModule.forRoot(MeetingApp),
      AngularFirestoreModule,
      AngularFireModule.initializeApp(ENVIRONMENTS.firebase),
      SharedModule.forRoot()
   ],
   bootstrap: [IonicApp],
   entryComponents: [
      MeetingApp,
      ProgressBarComponent
   ],
   providers: [
      Firebase,
      AuthService,
      ApplicationService, 
      GlobalService,
      Network,
      NetworkService,
      FirebaseService,
      AngularFireAuth,
      CodePush,   
      StatusBar,
      SplashScreen,
      { provide: ErrorHandler, useClass: IonicErrorHandler }
   ]
})
export class AppModule {
   constructor() {
      console.log('AppModule constructor');
   }
}
