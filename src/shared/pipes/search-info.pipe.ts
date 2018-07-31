import { Pipe, PipeTransform } from '@angular/core';
 
@Pipe({ name: 'searchInfo' })
export class SearchInfoPipe implements PipeTransform {
  transform(arr: any[], searchText: string) {
     if (!arr) return []
     var x = arr
     var res = x.filter(item => {
      if (!searchText) searchText = ""
      let str = JSON.stringify(item).toLowerCase();
      return (str.indexOf(searchText.toLowerCase()) !== -1)
    })
    return res
  }
}
