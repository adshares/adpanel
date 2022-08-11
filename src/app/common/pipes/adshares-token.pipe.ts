import { Pipe, PipeTransform } from '@angular/core'
import { Store } from '@ngrx/store'
import { HandleSubscription } from 'common/handle-subscription'
import { ServerOptionsService } from 'common/server-options.service'
import { CRYPTO, CRYPTO_BTC } from 'common/utilities/consts'
import {
  calcCampaignBudgetPerDay,
  currencySymbolByCode,
  formatMoney,
  formatNumberWithComma,
} from 'common/utilities/helpers'
import { NOT_AVAILABLE } from 'common/utilities/messages'
import { AppState } from 'models/app-state.model'
import { ExchangeRate } from 'models/user.model'
import { filter, take } from 'rxjs/operators'

function removeDecimalPart(value: number | string) {
  return (`${value}`).split('.')[0];
}

@Pipe({
  name: 'formatMoney'
})
export class AdsharesTokenPipe extends HandleSubscription implements PipeTransform {
  private appCurrencyCode: string
  private currencyCode: string

  constructor (private serverOptionsService : ServerOptionsService) {
    super()
    const optionsSubscription = serverOptionsService.getOptions()
      .pipe(take(1))
      .subscribe(options => {
        this.appCurrencyCode = options.appCurrency
        this.currencyCode = options.displayCurrency
      })
    this.subscriptions.push(optionsSubscription)
  }

  transform (value: number | string, precision: number = 11, currency: string = 'other', format: string = 'symbol'): string {
    let symbol, code;

    if (format === 'none') {
      symbol = code = '';
    } else if (currency === CRYPTO) {
      symbol = format === 'symbol' ? currencySymbolByCode(this.appCurrencyCode) : '';
      code = format !== 'symbol' ? this.appCurrencyCode : '';
    } else if (currency === CRYPTO_BTC) {
      symbol = format === 'symbol' ? CRYPTO_BTC.toUpperCase() : '';
      code = format !== 'symbol' ? CRYPTO_BTC.toUpperCase() : '';
    } else {
      symbol = format === 'symbol' ? currencySymbolByCode(this.currencyCode) : '';
      code = format !== 'symbol' ? this.currencyCode : '';
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
