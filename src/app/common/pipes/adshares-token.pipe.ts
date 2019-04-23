import {
  Pipe,
  PipeTransform
} from '@angular/core';
import { formatMoney } from 'common/utilities/helpers';

function removeDecimalPart(value: number | string) {
  return (`${value}`).split('.')[0];
}

@Pipe({
  name: 'adsharesTokenValue'
})

export class AdsharesTokenPipe implements PipeTransform {
  transform(value: number | string, prependCurrencySymbol: string, precision: number = 11): string {
    const showNarrowCurrencySign = prependCurrencySymbol ? prependCurrencySymbol : '';
    const formatInADS = !prependCurrencySymbol ? 'ADS' : '';

    return `${showNarrowCurrencySign} ${formatMoney(removeDecimalPart(value), precision)} ${formatInADS}`;
  }
}

@Pipe({
  name: 'ClickToADS'
})

export class ClickToADSPipe implements PipeTransform {
  transform(value: number, precision: number = 11): number {
    const formattedMoney = formatMoney(removeDecimalPart(value), precision)
      .split('.')[0]
      .split(',')
      .join('');
    return parseInt(formattedMoney);
  }
}
