import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { LoginPage } from './login'
import { SharedModule } from '../../shared/shared.module'


@NgModule({
   imports: [
      SharedModule.forRoot(),
      IonicPageModule.forChild(LoginPage),
   ],
   declarations: [
      LoginPage
   ],
   entryComponents: [],
   providers: []
})
export class LoginModule {
   constructor() {
      console.log('LoginModule constructor')
   }
}
