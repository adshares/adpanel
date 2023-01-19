import { Pipe, PipeTransform } from '@angular/core';
import { mapToIterable } from 'common/utilities/helpers';

@Pipe({
  name: 'mapToIterable',
})
export class MapToIterablePipe implements PipeTransform {
  transform(dict: Object): any[] {
    return mapToIterable(dict);
  }
}
