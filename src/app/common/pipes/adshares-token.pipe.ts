import {
  Pipe,
  PipeTransform
} from '@angular/core';
import { formatMoney } from 'common/utilities/helpers';
import { AppState } from "models/app-state.model";
import { Store } from "@ngrx/store";
import { ExchangeRate } from "models/user.model";
import { HandleSubscription } from "common/handle-subscription";
import { NOT_AVAILABLE } from "common/utilities/messages";
import { environment } from "environments/environment";

function removeDecimalPart(value: number | string) {
  return (`${value}`).split('.')[0];
}

@Pipe({
  name: 'adsharesTokenValue'
})

export class AdsharesTokenPipe implements PipeTransform {
  transform(value: number | string, prependCurrencySymbol: string, precision: number = 11): string {
    const formatInCustomCurrency = prependCurrencySymbol ? prependCurrencySymbol : '';
    const formatInCryptoCurrency = !prependCurrencySymbol ? environment.cryptoSymbol : '';

    return `${formatInCustomCurrency} ${formatMoney(removeDecimalPart(value), precision)} ${formatInCryptoCurrency}`;
  }
}

@Pipe({
  name: 'calculateInCurrency'
})

export class CalculateInCurrency extends HandleSubscription implements PipeTransform {
  data: ExchangeRate;

  constructor(private store: Store<AppState>) {
    super();
    const exchangeDataSubscription = store.select('state', 'user', 'data', 'exchangeRate').subscribe(
      exchangeData => {
        this.data = exchangeData
      }
    );
    this.subscriptions.push(exchangeDataSubscription);
  }

  transform(value: number, precision: number = 11): string {
    if (this.data !== null) {
      const calculateInCurrency = value > 0 ? value * this.data.value : 0;
      return `${formatMoney(removeDecimalPart(calculateInCurrency), precision)} ${this.data.currency}`;
    } else {
      return NOT_AVAILABLE;
    }
  };
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
