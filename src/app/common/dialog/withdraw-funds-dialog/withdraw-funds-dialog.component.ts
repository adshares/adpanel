import { Component, OnInit } from '@angular/core';
import { Store} from '@ngrx/store';
import { MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { HandleSubscription } from 'common/handle-subscription';
import { SettingsService } from 'settings/settings.service';
import { AppState} from 'models/app-state.model';
import { User, UserFinancialData } from 'models/user.model';

import { appSettings } from 'app-settings';

@Component({
  selector: 'app-withdraw-funds-dialog',
  templateUrl: './withdraw-funds-dialog.component.html',
  styleUrls: ['./withdraw-funds-dialog.component.scss']
})
export class WithdrawFundsDialogComponent extends HandleSubscription implements OnInit {
  withdrawFundsForm: FormGroup;

  financialData: UserFinancialData;

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
        this.financialData = user.financialData;
      });
    this.subscriptions.push(userDataSubscription);

    this.createForm();
  }

  createForm() {
    this.withdrawFundsForm = new FormGroup({
      address: new FormControl(this.financialData.userEthAddress, [
        Validators.required,
        Validators.minLength(42),
        Validators.maxLength(42)
      ]),
      amount: new FormControl('', [Validators.required]),
      memo: new FormControl('', [Validators.maxLength(32)])
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
