import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { CommonModule } from '@angular/common'
import { SocialSharing } from '@ionic-native/social-sharing'
import { EditEventPage } from './editEvent'
import { SharedModule } from '../../shared/shared.module'


@NgModule({
   declarations: [
      EditEventPage
   ],
   imports: [
      SharedModule.forRoot(),
      CommonModule,
      IonicPageModule.forChild(EditEventPage)
   ],
   exports: [EditEventPage],
   providers: [SocialSharing]
})

export class EditEventPageModule {
   constructor() {
      console.log('EditEventPageModule constructor');
   }
};