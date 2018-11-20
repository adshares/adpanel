import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { HandleSubscription } from 'common/handle-subscription';
import { SettingsService } from 'settings/settings.service';
import { AppState } from 'models/app-state.model';
import { User, UserAdserverWallet } from 'models/user.model';

import { appSettings } from 'app-settings';

@Component({
  selector: 'app-withdraw-funds-dialog',
  templateUrl: './withdraw-funds-dialog.component.html',
  styleUrls: ['./withdraw-funds-dialog.component.scss']
})
export class WithdrawFundsDialogComponent extends HandleSubscription implements OnInit {
  withdrawFundsForm: FormGroup;

  adserverWallet: UserAdserverWallet;

  memoInputActive = false;
  isFormBeingSubmitted = false;
  withdrawFormSubmitted = false;
  isEmailConfirmed = false;

  txFee: number = appSettings.TX_FEE;

  constructor(
    public dialogRef: MatDialogRef<WithdrawFundsDialogComponent>,
    private store: Store<AppState>,
    private settingsService: SettingsService
  ) {
    super();
  }

  ngOnInit() {

    const userDataSubscription = this.store.select('state', 'user', 'data')
      .subscribe((user: User) => {
        this.isEmailConfirmed = user.isEmailConfirmed;
        this.adserverWallet = user.adserverWallet;
      });

    this.settingsService.checkUserStatus()
      .subscribe((user: User) => {
        this.isEmailConfirmed = user.isEmailConfirmed;
        this.adserverWallet = user.adserverWallet;
      });

    this.subscriptions.push(userDataSubscription);

    this.createForm();
  }

  createForm() {
    this.withdrawFundsForm = new FormGroup({
      address: new FormControl(this.adserverWallet.adsharesAddress, [
        Validators.required,
        Validators.pattern(appSettings.ADDRESS_REGEXP)
      ]),
      amount: new FormControl('', [Validators.required]),
      memo: new FormControl('', Validators.pattern('[0-9a-fA-F]{64}'))
    });
  }

  toggleMemoInput(event, state) {
    event.preventDefault();
    this.memoInputActive = state;
  }

  withdrawFunds() {
    this.withdrawFormSubmitted = true;

    if (!this.withdrawFundsForm.valid) {
      return;
    }

    this.isFormBeingSubmitted = true;

    const changeWithdrawAddressSubscription = this.settingsService.withdrawFunds(
      this.withdrawFundsForm.value.address,
      this.withdrawFundsForm.value.amount,
      this.withdrawFundsForm.value.memo
    )
      .subscribe(() => this.dialogRef.close());

    this.subscriptions.push(changeWithdrawAddressSubscription);
  }
}
