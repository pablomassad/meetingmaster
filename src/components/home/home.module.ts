import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { HomePage } from './home'
//import { OrderModule } from 'ngx-order-pipe'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'

import { SharedModule } from '../../shared/shared.module'
import { EventPageModule } from '../../components/event/event.module'
import { PipesModule } from '../../shared/pipes/pipes.module';

@NgModule({
   declarations: [
      HomePage
   ],
   imports: [
      HttpClientModule,
      SharedModule.forRoot(),
      EventPageModule,
      PipesModule,
      //OrderModule,
      CommonModule,
      IonicPageModule.forChild(HomePage)
   ],
   providers: []
})
export class HomePageModule {
   constructor() {
      console.log('HomePageModule constructor');
   }
}
