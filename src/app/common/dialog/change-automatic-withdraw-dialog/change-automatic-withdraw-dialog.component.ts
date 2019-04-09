import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';

import { SettingsService } from 'settings/settings.service';
import { AppState } from 'models/app-state.model';
import { HandleSubscription } from 'common/handle-subscription';
import { enumToArray } from 'common/utilities/helpers';
import { withdrawPeriodsEnum } from 'models/enum/withdraw.enum';
import { appSettings } from 'app-settings';
import { LocalStorageUser, User } from 'models/user.model';

import * as authActions from 'store/auth/auth.actions';

@Component({
  selector: 'app-change-automatic-withdraw-dialog',
  templateUrl: './change-automatic-withdraw-dialog.component.html',
  styleUrls: ['./change-automatic-withdraw-dialog.component.scss']
})
export class ChangeAutomaticWithdrawDialogComponent extends HandleSubscription implements OnInit {
  automaticWithdrawForm: FormGroup;
  periods = enumToArray(withdrawPeriodsEnum);
  periodsEnum = withdrawPeriodsEnum;
  amounts = appSettings.WITHDRAWAL_AMOUNTS;
  isFormBeingSubmitted = false;
  automaticWithdrawFormSubmitted = false;
  isEmailConfirmed = false;

  currentAmount: number = 300;
  currentPeriod: number = 3;

  constructor(
    public dialogRef: MatDialogRef<ChangeAutomaticWithdrawDialogComponent>,
    private store: Store<AppState>,
    private settingsService: SettingsService
  ) {
    super();
  }

  ngOnInit() {
    this.createForm();

    const userSubscription = this.store.select('state', 'user', 'data', 'isEmailConfirmed')
      .subscribe((isEmailConfirmed: boolean) => {
        this.isEmailConfirmed = isEmailConfirmed;
      });

    this.subscriptions.push(userSubscription);
  }

  createForm() {
    this.automaticWithdrawForm = new FormGroup({
      period: new FormControl(),
      amount: new FormControl()
    });
  }

  saveNewAutomaticWithdrawOptions() {
    this.automaticWithdrawFormSubmitted = true;

    if (!this.automaticWithdrawForm.valid) {
      return;
    }

    this.isFormBeingSubmitted = true;

    const period = this.automaticWithdrawForm.value.period;
    const amount = this.automaticWithdrawForm.value.amount;

    const automaticWithdrawSubscription = this.settingsService.changeAutomaticWithdraw(period, amount)
      .subscribe(() => this.dialogRef.close());

    this.subscriptions.push(automaticWithdrawSubscription);

    const userData = JSON.parse(localStorage.getItem('adshUser'));

    const newLocalStorageUser: LocalStorageUser = Object.assign({}, userData, {
      autoWithdrawPeriod: period,
      autoWithdrawAmount: amount
    });

    localStorage.setItem('adshUser', JSON.stringify(newLocalStorageUser));

    this.store.dispatch(new authActions.UpdateUserAutomaticWithdrawPeriod(period));
    this.store.dispatch(new authActions.UpdateUserAutomaticWithdrawAmount(amount));
  }
}
