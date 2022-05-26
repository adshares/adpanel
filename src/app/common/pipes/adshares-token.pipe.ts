import { Pipe, PipeTransform } from '@angular/core';
import { calcCampaignBudgetPerDay, formatMoney } from 'common/utilities/helpers';
import { AppState } from "models/app-state.model";
import { Store } from "@ngrx/store";
import { ExchangeRate } from "models/user.model";
import { NOT_AVAILABLE } from "common/utilities/messages";
import { environment } from "environments/environment";
import { CRYPTO, CRYPTO_BTC } from "common/utilities/consts";
import { take } from 'rxjs/operators';

function removeDecimalPart(value: number | string) {
  return (`${value}`).split('.')[0];
}

@Pipe({
  name: 'formatMoney'
})
export class AdsharesTokenPipe implements PipeTransform {
  transform(value: number | string, precision: number = 11, currency: string = 'other', format: string = 'symbol',): string {
    let symbol, code;

    if (format === 'none') {
      symbol = code = '';
    } else if (currency === CRYPTO) {
      symbol = format === 'symbol' ? environment.cryptoSymbol : '';
      code = format !== 'symbol' ? environment.cryptoSymbol : '';
    } else if (currency === CRYPTO_BTC) {
      symbol = format === 'symbol' ? CRYPTO_BTC.toUpperCase() : '';
      code = format !== 'symbol' ? CRYPTO_BTC.toUpperCase() : '';
    } else {
      symbol = format === 'symbol' ? environment.currencySymbol : '';
      code = format !== 'symbol' ? environment.currencySymbol : '';
    }

    return `${symbol}${formatMoney(removeDecimalPart(value), precision)} ${code}`;
  }
}

@Pipe({
  name: 'calculateInCurrency'
})
export class CalculateInCurrency implements PipeTransform {
  data: ExchangeRate;

  constructor(private store: Store<AppState>) {
    store.select('state', 'user', 'data', 'exchangeRate')
      .pipe(take(1))
      .subscribe(exchangeData => {
        this.data = exchangeData
      });
  }

  transform(value: number, precision: number = 11): string {
    if (this.data !== null) {
      const calculateInCurrency = value > 0 ? value * this.data.value : 0;
      return `${formatMoney(removeDecimalPart(calculateInCurrency), precision)} ${this.data.currency}`;
    } else {
      return NOT_AVAILABLE;
    }
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

@Pipe({
  name: 'budgetPerDay'
})
export class AdsharesBudgetPerDayPipe implements PipeTransform {
  transform(value: number): number {
    return calcCampaignBudgetPerDay(value);
  }
}
