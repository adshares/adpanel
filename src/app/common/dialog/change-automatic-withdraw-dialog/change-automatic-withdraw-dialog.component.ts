import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
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
  periods = enumToArray(withdrawPeriodsEnum);
  amounts = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

  currentPeriod: string;
  currentAmount: number;

  constructor(
    public dialogRef: MatDialogRef<ChangeAutomaticWithdrawDialogComponent>,
    private store: Store<AppState>
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
}
