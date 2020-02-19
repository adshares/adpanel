import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { HandleSubscription } from 'common/handle-subscription';
import { DepositInfo, NowPaymentsInfo, NowPaymentsInit } from 'models/settings.model';
import { ApiService } from 'app/api/api.service';
import { SessionService } from 'app/session.service';
import { isNumeric } from "rxjs/util/isNumeric";
import { environment } from "environments/environment";
import { CODE, CRYPTO } from "common/utilities/consts";

@Component({
  selector: 'app-add-funds-dialog',
  templateUrl: './add-funds-dialog.component.html',
  styleUrls: ['./add-funds-dialog.component.scss']
})
export class AddFundsDialogComponent extends HandleSubscription implements OnInit {
  environment = environment;
  crypto: string = CRYPTO;
  code: string = CODE;
  isEmailConfirmed = false;

  loadingInfo: boolean = true;
  useNativeDeposit: boolean = false;
  useNowPaymentsDeposit: boolean = false;

  adsharesAddress: string = '';
  paymentMemo: string = '';

  nowPayments: NowPaymentsInfo;
  nowPaymentsDefaultAmount: number = 50;
  nowPaymentsAmount: number;
  nowPaymentsAdsAmount: number;
  nowPaymentsAmountError: boolean = false;
  nowPaymentsServerError: boolean = false;

  isFormBeingSubmitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddFundsDialogComponent>,
    private api: ApiService,
    private session: SessionService,
  ) {
    super();
  }

  ngOnInit() {
    const user = this.session.getUser();
    this.isEmailConfirmed = user.isEmailConfirmed;

    const infoSubscription = this.api.config.depositInfo().subscribe((data: DepositInfo) => {
      this.loadingInfo = false;
      this.adsharesAddress = data.address;
      this.paymentMemo = data.message;
      this.nowPayments = data.nowPayments;
      if (this.nowPayments !== null) {
        this.setNowPaymentsAmount(this.nowPaymentsDefaultAmount);
      } else {
        this.useNativeDeposit = true;
      }
    });

    this.subscriptions.push(infoSubscription);
  }

  copyInput(input: HTMLInputElement): void {
    input.select();
    document.execCommand('copy');
    input.setSelectionRange(0, 0);
  }

  selectNativeDeposit(): void {
    this.useNativeDeposit = true;
    this.useNowPaymentsDeposit = false;
  }

  selectNowPaymentsDeposit(): void {
    this.useNativeDeposit = false;
    this.useNowPaymentsDeposit = true;
  }

  restartDepositMethod(): void {
    this.useNativeDeposit = this.nowPayments === null;
    this.useNowPaymentsDeposit = false;
  }

  validNowPaymentsAmount(amount) {
    return isNumeric(amount) && amount >= this.nowPayments.minAmount && amount <= this.nowPayments.maxAmount
  }

  setNowPaymentsAmount(amount: number) {
    this.nowPaymentsAmount = amount;
    this.nowPaymentsAdsAmount = Math.round(1e11 * (this.nowPaymentsAmount / this.nowPayments.exchangeRate));
  }

  keydownNowPaymentsAmount(event) {
    if (this.validNowPaymentsAmount(event.target.value)) {
      this.setNowPaymentsAmount(event.target.value)
    }
  }

  changeNowPaymentsAmount(event) {
    if (!this.validNowPaymentsAmount(event.target.value)) {
      this.nowPaymentsAdsAmount = null;
      this.nowPaymentsAmountError = true;
      return;
    }

    this.nowPaymentsAmountError = false;
    this.setNowPaymentsAmount(event.target.value)
  }

  depositNowPaymentsFunds() {
    this.isFormBeingSubmitted = true;
    this.nowPaymentsServerError = false;

    if (this.nowPaymentsAmountError) {
      this.isFormBeingSubmitted = false;
      return;
    }

    this.api.config.nowPaymentsInit(this.nowPaymentsAmount)
      .subscribe((data: NowPaymentsInit) => {
        if (data.nowPaymentsUrl) {
          window.location.href = data.nowPaymentsUrl;
        } else {
          this.isFormBeingSubmitted = false;
          this.nowPaymentsServerError = true;
        }
      });
  }
}
