import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaReplacer'
})

export class CommaReplacerPipe implements PipeTransform {
  transform(value: string, args: any[]): string {
    return value.replace(',', '');
  }
}
