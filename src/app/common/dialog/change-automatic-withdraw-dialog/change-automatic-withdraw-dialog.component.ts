import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';

import { SettingsService } from '../../../settings/settings.service';
import { AppState } from '../../../models/app-state.model';
import { HandleSubscription } from '../../handle-subscription';

import { enumToArray } from '../../utilities/helpers';
import { withdrawPeriodsEnum } from '../../../models/enum/withdraw.enum';
import { appSettings } from '../../../../app-settings/app-settings';
import { LocalStorageUser } from '../../../models/user.model';

import * as authActions from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-change-automatic-withdraw-dialog',
  templateUrl: './change-automatic-withdraw-dialog.component.html',
  styleUrls: ['./change-automatic-withdraw-dialog.component.scss']
})
export class ChangeAutomaticWithdrawDialogComponent extends HandleSubscription implements OnInit {
  automaticWithdrawForm: FormGroup;

  periods = enumToArray(withdrawPeriodsEnum);
  amounts = appSettings.WITHDRAWAL_AMOUNTS;
  currentPeriod: string;
  currentAmount: number;

  isFormBeingSubmitted = false;
  automaticWithdrawFormSubmitted = false;

  constructor(
    public dialogRef: MatDialogRef<ChangeAutomaticWithdrawDialogComponent>,
    private store: Store<AppState>,
    private settingsService: SettingsService
  ) {
    super(null);
  }

  ngOnInit() {
    this.createForm();

    const currentPeriodSubscription = this.store.select('state', 'user', 'data', 'userAutomaticWithdrawPeriod')
      .subscribe((currentPeriod: number) => {
        this.currentPeriod = this.periods[currentPeriod];
    });

    const currentAmountSubscription = this.store.select('state', 'user', 'data', 'userAutomaticWithdrawAmount')
      .subscribe((currentAmount: number) => {
        this.currentAmount = currentAmount;
    });
    this.subscriptions.push(currentPeriodSubscription, currentAmountSubscription);
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
      .subscribe(() => {
        this.dialogRef.close();
      });

    this.subscriptions.push(automaticWithdrawSubscription);

    const userData = JSON.parse(localStorage.getItem('adshUser'));
    const periodIndex = this.periods.findIndex((searchedPeriod) => searchedPeriod === period );

    const newLocalStorageUser: LocalStorageUser = Object.assign({}, userData, {
      userAutomaticWithdrawPeriod: periodIndex,
      userAutomaticWithdrawAmount: amount
    });

    console.log(typeof periodIndex)
    localStorage.setItem('adshUser', JSON.stringify(newLocalStorageUser));

    this.store.dispatch(new authActions.UpdateUserAutomaticWithdrawPeriod(periodIndex));
    this.store.dispatch(new authActions.UpdateUserAutomaticWithdrawAmount(amount));

  }
}
