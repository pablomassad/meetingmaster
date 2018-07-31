import { NgModule, ModuleWithProviders } from '@angular/core'
import { IonicModule } from 'ionic-angular'
import { SearchInfoPipe } from './search-info.pipe';
import { OrderModule } from 'ngx-order-pipe';


@NgModule({
   imports: [
      IonicModule,
      OrderModule
   ],
   declarations: [
      SearchInfoPipe
   ],
   exports: [
      SearchInfoPipe,
      OrderModule
   ]
})
export class PipesModule {
   
}
