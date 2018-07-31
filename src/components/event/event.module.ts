import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { CommonModule } from '@angular/common'
import { Ionic2RatingModule } from 'ionic2-rating'

import { EventPage } from './event'
import { SharedModule } from '../../shared/shared.module'


@NgModule({
   declarations: [
      EventPage
   ],
   imports: [
      SharedModule.forRoot(),
      CommonModule,
      IonicPageModule.forChild(EventPage),
      Ionic2RatingModule
   ],
   exports: [EventPage],
   providers: []
})

export class EventPageModule {
   constructor() {
      console.log('EventPageModule constructor');
   }
};