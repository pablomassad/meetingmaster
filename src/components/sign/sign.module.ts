import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { SignPage } from './sign'
//import { OrderModule } from 'ngx-order-pipe'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'

import { SharedModule } from '../../shared/shared.module'
import { EventPageModule } from '../../components/event/event.module'
import { PipesModule } from '../../shared/pipes/pipes.module';

@NgModule({
   declarations: [
      SignPage
   ],
   imports: [
      SharedModule.forRoot(),
      EventPageModule,
      CommonModule,
      IonicPageModule.forChild(SignPage)
   ],
   providers: []
})
export class SignPageModule {
   constructor() {
      console.log('SignPageModule constructor');
   }
}
