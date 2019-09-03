import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from "@angular/common/http";

import { HandleSubscription } from 'common/handle-subscription';
import { SettingsService } from 'settings/settings.service';
import { AppState } from 'models/app-state.model';
import { User, UserAdserverWallet } from 'models/user.model';

import { adsToClicks, formatMoney } from 'common/utilities/helpers';
import { appSettings } from 'app-settings';
import { CalculateWithdrawalItem } from "models/settings.model";
import * as codes from 'common/utilities/codes';
import { ErrorResponseDialogComponent } from "common/dialog/error-response-dialog/error-response-dialog.component";
import { WithdrawFundsSuccess } from 'store/settings/settings.actions';
import { environment } from "environments/environment";
import { CODE, CRYPTO } from "common/utilities/consts";

@Component({
  selector: 'app-withdraw-funds-dialog',
  templateUrl: './withdraw-funds-dialog.component.html',
  styleUrls: ['./withdraw-funds-dialog.component.scss']
})
export class WithdrawFundsDialogComponent extends HandleSubscription implements OnInit {
  crypto: string = CRYPTO;
  code: string = CODE;
  cryptoCode: string = environment.cryptoCode;
  withdrawFundsForm: FormGroup;
  adserverWallet: UserAdserverWallet;
  memoInputActive = false;
  isFormBeingSubmitted = false;
  withdrawFormSubmitted = false;
  showAddressError = false;
  isEmailConfirmed = false;
  walletBalance: number;

  calculatedFee: number;
  calculatedTotal: number;
  calculatedLeft: number;

  constructor(
    public dialogRef: MatDialogRef<WithdrawFundsDialogComponent>,
    private store: Store<AppState>,
    private settingsService: SettingsService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    const userDataSubscription = this.store.select('state', 'user', 'data')
      .subscribe((user: User) => {
        this.isEmailConfirmed = user.isEmailConfirmed;
        this.adserverWallet = user.adserverWallet;
      });
    const userDataStateSubscription = this.store.select('state', 'user', 'data', 'adserverWallet')
      .subscribe((wallet: UserAdserverWallet) => {
        this.walletBalance = wallet.walletBalance
      });
    this.subscriptions.push(userDataSubscription, userDataStateSubscription);
    this.createForm();
  }

  onCalculateWithdrawalError(err: HttpErrorResponse): void {
    if (err.status !== codes.HTTP_INTERNAL_SERVER_ERROR) {
      this.dialog.open(ErrorResponseDialogComponent, {
        data: {
          title: `Error during calculation`,
          message: `Please check, if address and amount are correct.`,
        }
      });
    }

    this.calculatedFee = undefined;
    this.calculatedTotal = undefined;
    this.calculatedLeft = undefined;
  }

  onCalculateWithdrawalSuccess(response: CalculateWithdrawalItem): void {
    this.withdrawFundsForm.get('amount').setValue(formatMoney(response.amount, 11, false, '.', ''));

    this.calculatedFee = response.fee;
    this.calculatedTotal = response.total;
    this.calculatedLeft = this.adserverWallet ? (this.adserverWallet.totalFunds - response.total) : undefined;
  }

  calculateFee(): void {
    this.withdrawFormSubmitted = true;

    if (!this.withdrawFundsForm.valid) {
      return;
    }

    this.settingsService.calculateWithdrawal(
      this.withdrawFundsForm.value.address,
      adsToClicks(this.withdrawFundsForm.value.amount)
    )
      .subscribe(
        (response: CalculateWithdrawalItem) => this.onCalculateWithdrawalSuccess(response),
        (err: HttpErrorResponse) => this.onCalculateWithdrawalError(err)
      );
  }

  createForm(): void {
    this.withdrawFundsForm = new FormGroup({
      address: new FormControl('', [
        Validators.required,
        Validators.pattern(appSettings.ADDRESS_REGEXP)
      ]),
      amount: new FormControl('', [Validators.required]),
      memo: new FormControl('', Validators.pattern('[0-9a-fA-F]{64}'))
    });
  }

  toggleMemoInput(event: Event, state: boolean) {
    event.preventDefault();
    this.memoInputActive = state;
  }

  withdrawFunds(): void {
    this.withdrawFormSubmitted = true;

    if (!this.withdrawFundsForm.valid) {
      return;
    }

    this.isFormBeingSubmitted = true;

    const changeWithdrawAddressSubscription = this.settingsService.withdrawFunds(
      this.withdrawFundsForm.value.address,
      adsToClicks(this.withdrawFundsForm.value.amount),
      this.withdrawFundsForm.value.memo
    )
      .subscribe(
        () => {
          this.store.dispatch(new WithdrawFundsSuccess({}));
          this.dialogRef.close();
        },
        (err: HttpErrorResponse) => {
          this.withdrawFormSubmitted = false;
          this.isFormBeingSubmitted = false;
          if (err.status !== codes.HTTP_INTERNAL_SERVER_ERROR) {
            this.dialog.open(ErrorResponseDialogComponent, {
              data: {
                title: `Error during withdrawal`,
                message: `Please check, if address and amount are correct.`,
              }
            });
          }
        }
      );

    this.subscriptions.push(changeWithdrawAddressSubscription);
  }

  getMaxWithdrawAmount() {
    if (!this.withdrawFundsForm.get('address').valid) {
      this.showAddressError = true;
      return;
    }
    this.settingsService.calculateWithdrawal(this.withdrawFundsForm.get('address').value)
      .subscribe(
        (response: CalculateWithdrawalItem) => this.onCalculateWithdrawalSuccess(response),
        (err) => this.onCalculateWithdrawalError(err)
      );
  }
}
