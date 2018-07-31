import { NgModule, ModuleWithProviders } from '@angular/core'
import { IonicModule } from 'ionic-angular'
import { IonicStorageModule } from '@ionic/storage'
import { CommonModule } from '@angular/common'

import { HoursComponent } from './components/hours/hours.component'
import { ToolsBarComponent } from './components/tools-bar/tools-bar.component'

@NgModule({
   imports: [
      CommonModule,
      IonicModule,
      IonicStorageModule.forRoot()
   ],
   declarations: [
      HoursComponent,
      ToolsBarComponent
   ],
   exports: [
      HoursComponent,
      ToolsBarComponent
   ]
})
export class SharedModule {
   static forRoot(): ModuleWithProviders {
      return {
         ngModule: SharedModule,
         providers: [
         ]
      };
   }
}
