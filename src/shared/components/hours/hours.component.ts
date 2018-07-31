import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core'

import { GlobalService, ApplicationService } from 'fwk-services'

@Component({
   selector: 'hours',
   templateUrl: 'hours.component.html'
})
export class HoursComponent implements OnInit, OnDestroy {
   @Input() dictionary: any = []
   @Input('max') maxVal: number = 0
   @Output() selectedCell = new EventEmitter()

   constructor(
   ) {
      console.log('HoursComponent constructor')
   }

   ngOnDestroy() {
      console.warn('HoursComponent destroy')
   }
   ngOnInit(): void {
      console.log('HoursComponent init')
   }

   selCell(hr){
      this.selectedCell.emit(hr)
   }

   calculateOpacity(val){
      return (val/this.maxVal)
   }
}
