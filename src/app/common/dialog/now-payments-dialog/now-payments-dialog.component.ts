import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { HandleSubscription } from 'common/handle-subscription';
import { NowPaymentsInfo, NowPaymentsInit } from 'models/settings.model';
import { ApiService } from 'app/api/api.service';
import { SessionService } from 'app/session.service';
import { CODE, CRYPTO } from "common/utilities/consts";
import { isNumeric } from "rxjs/util/isNumeric";
import { environment } from "environments/environment";

@Component({
  selector: 'app-now-payments-dialog',
  templateUrl: './now-payments-dialog.component.html',
  styleUrls: ['./now-payments-dialog.component.scss']
})
export class NowPaymentsDialogComponent extends HandleSubscription implements OnInit {
  environment = environment;
  crypto: string = CRYPTO;
  code: string = CODE;
  isEmailConfirmed = false;

  defaultAmount = 25;
  minAmount: number;
  maxAmount: number = 10000;
  exchangeRate: number;
  currency: string = '';
  availableCurrencies: string[];

  amount: number;
  adsAmount: number;
  isFormBeingSubmitted: boolean = false;
  amountError: boolean = false;
  serverError: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<NowPaymentsDialogComponent>,
    private api: ApiService,
    private session: SessionService,
  ) {
    super();
  }

  ngOnInit() {
    const user = this.session.getUser();
    this.isEmailConfirmed = user.isEmailConfirmed;

    this.api.config.nowPaymentsInfo()
      .subscribe((data: NowPaymentsInfo) => {
        this.minAmount = data.minAmount;
        this.exchangeRate = data.exchangeRate;
        this.currency = data.currency;
        this.availableCurrencies = data.availableCurrencies;
        this.setAmount(this.defaultAmount);
      });
  }

  validAmount(amount) {
    return isNumeric(amount) && amount >= this.minAmount && amount <= this.maxAmount
  }

  setAmount(amount: number) {
    this.amount = amount;
    this.adsAmount = 1e11 * (this.amount / this.exchangeRate);
  }

  keydownAmount(event) {
    if (this.validAmount(event.target.value)) {
      this.setAmount(event.target.value)
    }
  }

  changeAmount(event) {
    if (!this.validAmount(event.target.value)) {
      this.adsAmount = null;
      this.amountError = true;
      return;
    }

    this.amountError = false;
    this.setAmount(event.target.value)
  }

  depositFunds() {
    this.isFormBeingSubmitted = true;
    this.serverError = false;

    if (this.amountError) {
      this.isFormBeingSubmitted = false;
      return;
    }

    this.api.config.nowPaymentsInit(this.amount)
      .subscribe((data: NowPaymentsInit) => {
        if (data.nowPaymentsUrl) {
          window.location.href = data.nowPaymentsUrl;
        } else {
          this.isFormBeingSubmitted = false;
          this.serverError = true;
        }
      });
  }
}
