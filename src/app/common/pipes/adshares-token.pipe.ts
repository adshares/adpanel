import {Pipe, PipeTransform} from '@angular/core';
import {formatMoney} from 'common/utilities/helpers';

function removeDecimalPart(value) {
  return (`${value}`).split('.')[0];
}

@Pipe({
  name: 'adsharesTokenValue'
})

export class AdsharesTokenPipe implements PipeTransform {
  transform(value, precision: number = 11) {
    return `${formatMoney(removeDecimalPart(value), precision)} ADS`;
  }
}
