import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapToIterable'
})
export class MapToIterablePipe implements PipeTransform {
  transform(dict: Object): any[] {
    let a = [];

    for (const key in dict) {
      if (dict.hasOwnProperty(key)) {
        a.push({key: key, value: dict[key]});
      }
    }

    return a;
  }
}
