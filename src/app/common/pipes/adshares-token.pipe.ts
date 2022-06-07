import { Pipe, PipeTransform } from '@angular/core'
import { Store } from '@ngrx/store'
import { HandleSubscription } from 'common/handle-subscription'
import { CRYPTO, CRYPTO_BTC } from 'common/utilities/consts'
import { calcCampaignBudgetPerDay, formatMoney, formatNumberWithComma } from 'common/utilities/helpers'
import { NOT_AVAILABLE } from 'common/utilities/messages'
import { environment } from 'environments/environment'
import { AppState } from 'models/app-state.model'
import { ExchangeRate } from 'models/user.model'
import { filter } from 'rxjs/operators'

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
export class CalculateInCurrency extends HandleSubscription implements PipeTransform {
  private rate: ExchangeRate = null;

  constructor(private store: Store<AppState>) {
    super();
    const exchangeDataSubscription = store.select('state', 'user', 'data', 'exchangeRate')
      .pipe(filter(exchangeRate => null !== exchangeRate))
      .subscribe(
        exchangeRate => {
          this.rate = exchangeRate
        }
      )
    this.subscriptions.push(exchangeDataSubscription);
  }

  transform(value: number, precision: number = 11): string {
    if (null === this.rate) {
      return NOT_AVAILABLE
    }
    const calculateInCurrency = value > 0 ? value * this.rate.value : 0
    return `${formatMoney(removeDecimalPart(calculateInCurrency), precision)} ${this.rate.currency}`
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

@Pipe({
  name: 'formatNumberWithComa'
})
export class FormatNumberWithCommaPipe implements PipeTransform  {
  transform(value: number | string): string {
  return formatNumberWithComma(value);
  }
}
