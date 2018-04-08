import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaReplacer'
})

export class CommaReplacerPipe implements PipeTransform {
  transform(value: string, args: any[]): string {
    if(value) {
      return value.replace(',', '');
    }
    return '';
  }
}
