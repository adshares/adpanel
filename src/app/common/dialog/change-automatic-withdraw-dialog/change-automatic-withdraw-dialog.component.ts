import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';

import { SettingsService } from '../../../settings/settings.service';
import { AppState } from '../../../models/app-state.model';
import { HandleSubscription } from '../../handle-subscription';

import { enumToArray } from '../../utilities/helpers';
import { withdrawPeriodsEnum } from '../../../models/enum/withdraw.enum';

@Component({
  selector: 'app-change-automatic-withdraw-dialog',
  templateUrl: './change-automatic-withdraw-dialog.component.html',
  styleUrls: ['./change-automatic-withdraw-dialog.component.scss']
})
export class ChangeAutomaticWithdrawDialogComponent extends HandleSubscription implements OnInit {
  automaticWithdrawForm: FormGroup = new FormGroup({
    period: new FormControl(),
    amount: new FormControl()
  });

  periods = enumToArray(withdrawPeriodsEnum);
  amounts = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
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
    const currentPeriodSubscription = this.store.select('state', 'user', 'data', 'userAutomaticWithdrawPeriod')
      .subscribe((currentPeriod: string) => {
      this.currentPeriod = currentPeriod;
    });
    const currentAmountSubscription = this.store.select('state', 'user', 'data', 'userAutomaticWithdrawAmount')
      .subscribe((currentAmount: number) => {
      this.currentAmount = currentAmount;
    });
    this.subscriptions.push(currentPeriodSubscription, currentAmountSubscription);
  }

  saveNewAutomaticWithdrawOptions() {
    this.automaticWithdrawFormSubmitted = true;

    if (!this.automaticWithdrawForm.valid) {
      return;
    }

    this.isFormBeingSubmitted = true;

    const automaticWithdrawSubscription = this.settingsService.changeAutomaticWithdraw(
      this.automaticWithdrawForm.value.period,
      this.automaticWithdrawForm.value.amount
    )
      .subscribe(() => {
        this.dialogRef.close();
      });

    this.subscriptions.push(automaticWithdrawSubscription);

  }
}
