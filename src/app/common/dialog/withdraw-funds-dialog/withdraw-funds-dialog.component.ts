import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { SettingsService } from 'settings/settings.service';
import { AppState } from 'models/app-state.model';
import { User, UserAdserverWallet } from 'models/user.model';

import { adsToClicks, formatMoney } from 'common/utilities/helpers';
import { appSettings } from 'app-settings';
import { BtcWithdrawInfo, CalculateWithdrawalItem, WithdrawalInfo } from 'models/settings.model';
import * as codes from 'common/utilities/codes';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';
import { WithdrawFundsSuccess } from 'store/settings/settings.actions';
import { CODE, CRYPTO, CRYPTO_BTC } from 'common/utilities/consts';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { SessionService } from '../../../session.service';
import { ApiService } from '../../../api/api.service';
import { ServerOptionsService } from 'common/server-options.service';

@Component({
  selector: 'app-withdraw-funds-dialog',
  templateUrl: './withdraw-funds-dialog.component.html',
  styleUrls: ['./withdraw-funds-dialog.component.scss'],
})
export class WithdrawFundsDialogComponent extends HandleSubscriptionComponent implements OnInit {
  crypto: string = CRYPTO;
  code: string = CODE;
  btc: string = CRYPTO_BTC;
  faQuestionCircle = faQuestionCircle;
  appCurrency: string;
  user: User;

  isConfirmed = false;
  isFormBeingSubmitted = false;
  adserverWallet: UserAdserverWallet;

  loadingInfo: boolean = true;
  useAdsWithdraw: boolean = false;
  useBtcWithdraw: boolean = false;

  withdrawForm: FormGroup;
  addressError = false;
  withdrawServerError: boolean = false;

  adsWithdrawFormSubmitted = false;

  calculatedFee: number;
  calculatedTotal: number;
  calculatedLeft: number;
  calculatedReceive: number;

  btcInfo: BtcWithdrawInfo;
  calculatedBtcAmount: number;

  constructor(
    public dialogRef: MatDialogRef<WithdrawFundsDialogComponent>,
    private store: Store<AppState>,
    private serverOptionsService: ServerOptionsService,
    private settingsService: SettingsService,
    private api: ApiService,
    private session: SessionService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.appCurrency = this.serverOptionsService.getOptions().appCurrency;
    this.user = this.session.getUser();
    this.isConfirmed = this.user.isConfirmed;
    this.adserverWallet = this.user.adserverWallet;

    const infoSubscription = this.api.config.withdrawalInfo().subscribe((data: WithdrawalInfo) => {
      this.btcInfo = data.btc;

      if (!this.user.email) {
        if ('ADS' === this.adserverWallet.walletNetwork || 'BSC' === this.adserverWallet.walletNetwork) {
          this.selectAdsWithdraw();
          this.loadingInfo = false;
        } else if ('BTC' === this.adserverWallet.walletNetwork && null !== this.btcInfo) {
          this.selectBtcWithdraw();
          this.loadingInfo = false;
        } else {
          this.dialog.open(ErrorResponseDialogComponent, {
            data: {
              title: 'Withdraw wallet error',
              message: 'Unsupported wallet network. Please change wallet network or provide e-mail address.',
            },
          });
        }
      } else if (this.btcInfo === null) {
        this.selectAdsWithdraw();
        this.loadingInfo = false;
      } else {
        this.loadingInfo = false;
      }
    });

    this.subscriptions.push(infoSubscription);
  }

  selectAdsWithdraw(): void {
    this.useAdsWithdraw = true;
    this.useBtcWithdraw = false;
    this.createForm();
  }

  selectBtcWithdraw(): void {
    this.useAdsWithdraw = false;
    this.useBtcWithdraw = true;
    this.createForm();
  }

  restartWithdrawMethod(): void {
    this.useAdsWithdraw = this.btcInfo === null;
    this.useBtcWithdraw = false;
  }

  onCalculateWithdrawalError(err: HttpErrorResponse): void {
    if (err.status !== codes.HTTP_INTERNAL_SERVER_ERROR) {
      this.dialog.open(ErrorResponseDialogComponent, {
        data: {
          title: `Error during calculation`,
          message: `Please check, if address and amount are correct.`,
        },
      });
    }

    this.calculatedFee = undefined;
    this.calculatedTotal = undefined;
    this.calculatedLeft = undefined;
    this.calculatedReceive = undefined;
  }

  onCalculateWithdrawalSuccess(response: CalculateWithdrawalItem): void {
    this.withdrawForm.get('amount').setValue(formatMoney(response.amount, 11, false, '.', ''));

    this.calculatedFee = response.fee;
    this.calculatedTotal = response.total;
    this.calculatedReceive = response.amount !== response.receive ? response.receive : undefined;
    this.calculatedLeft = this.adserverWallet ? this.adserverWallet.walletBalance - response.total : undefined;
  }

  calculateAdsFee(): void {
    this.adsWithdrawFormSubmitted = true;

    if (!this.withdrawForm.valid) {
      return;
    }

    this.settingsService
      .calculateWithdrawal(this.withdrawForm.value.address, adsToClicks(this.withdrawForm.value.amount))
      .subscribe(
        (response: CalculateWithdrawalItem) => this.onCalculateWithdrawalSuccess(response),
        (err: HttpErrorResponse) => this.onCalculateWithdrawalError(err)
      );
  }

  createForm(): void {
    this.isFormBeingSubmitted = false;
    this.adsWithdrawFormSubmitted = false;
    this.addressError = false;
    this.withdrawForm = this.useBtcWithdraw ? this.createBtcForm() : this.createAdsForm();
  }

  createAdsForm(): FormGroup {
    let address = 'ADS' === this.adserverWallet.walletNetwork ? this.adserverWallet.walletAddress : '';
    if ('BSC' === this.adserverWallet.walletNetwork) {
      address = this.adserverWallet.walletAddress;
    }
    return new FormGroup(
      {
        address: this.user.email
          ? new FormControl(address, [Validators.required, Validators.pattern(appSettings.ADDRESS_REGEXP)])
          : new FormControl(address),
        amount: new FormControl('', [Validators.required]),
        memo: new FormControl('', Validators.pattern('[0-9a-fA-F]{1,64}')),
      },
      (group: FormGroup): { [key: string]: any } => {
        let address = group.controls['address'];
        let memo = group.controls['memo'];

        if (address.value == '0001-0000002C-7E81' && memo.value == '') {
          return {
            memoError: true,
          };
        }
      }
    );
  }

  createBtcForm(): FormGroup {
    const address = 'BTC' === this.adserverWallet.walletNetwork ? this.adserverWallet.walletAddress : '';
    return new FormGroup({
      address: this.user.email
        ? new FormControl(address, [Validators.required, Validators.pattern(appSettings.BTC_ADDRESS_REGEXP)])
        : new FormControl(address),
      amount: new FormControl('', [
        Validators.required,
        Validators.min(this.btcInfo.minAmount),
        Validators.max(this.btcInfo.maxAmount),
      ]),
    });
  }

  calculateBtcWithdrawAdsAmount(value) {
    this.calculatedBtcAmount = value * this.btcInfo.exchangeRate * 1e11;
  }

  keyupBtcWithdrawAdsAmount(event) {
    this.calculateBtcWithdrawAdsAmount(event.target.value);
  }

  withdrawFunds(): void {
    this.adsWithdrawFormSubmitted = true;

    if (!this.withdrawForm.valid) {
      return;
    }

    this.isFormBeingSubmitted = true;

    const changeWithdrawAddressSubscription = this.settingsService
      .withdrawFunds(
        this.withdrawForm.value.address,
        adsToClicks(this.withdrawForm.value.amount),
        this.withdrawForm.value.memo ? this.withdrawForm.value.memo.padStart(64, '0') : '',
        this.useBtcWithdraw ? 'BTC' : 'ADS'
      )
      .subscribe(
        () => {
          this.store.dispatch(new WithdrawFundsSuccess({}));
          this.dialogRef.close();
        },
        () => {
          this.adsWithdrawFormSubmitted = false;
          this.isFormBeingSubmitted = false;
          this.withdrawServerError = true;
        }
      );

    this.subscriptions.push(changeWithdrawAddressSubscription);
  }

  getMaxAdsWithdrawAmount() {
    if (!this.withdrawForm.get('address').valid) {
      this.addressError = true;
      return;
    }
    this.settingsService.calculateWithdrawal(this.withdrawForm.get('address').value).subscribe(
      (response: CalculateWithdrawalItem) => this.onCalculateWithdrawalSuccess(response),
      err => this.onCalculateWithdrawalError(err)
    );
  }

  getMaxBtcWithdrawAmount() {
    const amount = formatMoney(
      Math.min(this.adserverWallet.walletBalance, 1e11 * this.btcInfo.maxAmount),
      11,
      false,
      '.',
      ''
    );
    this.withdrawForm.get('amount').setValue(amount);
    this.calculateBtcWithdrawAdsAmount(amount);
  }
}
