import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { CommonModule } from '@angular/common'
import { OrderModule } from 'ngx-order-pipe'

import { MemberStatusPage } from './memberStatus'
import { SharedModule } from '../../shared/shared.module'
import { PipesModule } from '../../shared/pipes/pipes.module';



@NgModule({
   declarations: [
      MemberStatusPage
   ],
   imports: [
      SharedModule.forRoot(),
      PipesModule,
      CommonModule,
      OrderModule,
      IonicPageModule.forChild(MemberStatusPage)
   ],
   exports: [MemberStatusPage],
   providers: []
})

export class MemberStatusPageModule {
   constructor() {
      console.log('MemberStatusPageModule constructor');
   }
};