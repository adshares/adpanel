import { Pipe, PipeTransform } from '@angular/core';
import { formatMoney } from 'common/utilities/helpers';

@Pipe({
  name: 'adsharesTokenValue'
})

export class AdsharesTokenPipe implements PipeTransform {
  transform(value, precision: number = 11) {
    return formatMoney(Math.round(value), precision) + ' ADS';
  }
}
