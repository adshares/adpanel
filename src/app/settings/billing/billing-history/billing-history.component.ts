import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { AppState } from 'models/app-state.model';
import { BillingHistoryItem } from 'models/settings.model';
import * as settingsActions from 'store/settings/settings.actions';

@Component({
  selector: 'app-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrls: ['./billing-history.component.scss'],
})
export class BillingHistoryComponent implements OnInit {
  subscription: Subscription;
  billingHistory: BillingHistoryItem[];

  constructor(private store: Store<AppState>) {
    this.subscription = store
      .select('state', 'user', 'settings', 'billingHistory')
      .subscribe(billingHistory => this.billingHistory = billingHistory);
  }

  ngOnInit() {
    this.store.dispatch(new settingsActions.LoadBillingHistory(''));
  };

}
