import {Pipe, PipeTransform} from '@angular/core';
import {formatMoney} from 'common/utilities/helpers';

function removeDecimalPart(value: number | string) {
  return (`${value}`).split('.')[0];
}

@Pipe({
  name: 'adsharesTokenValue'
})

export class AdsharesTokenPipe implements PipeTransform {
  transform(value: number | string, precision: number = 11): string {
    return `${formatMoney(removeDecimalPart(value), precision)} ADS`;
  }
}
