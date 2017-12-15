import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../../models/app-state.model';
import { BillingHistoryItem } from '../../../models/billing-history-item.model';

import * as settingsActions from '../../../store/settings/settings.actions';
import { SettingsService } from '../../settings.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrls: ['./billing-history.component.scss'],
})
export class BillingHistoryComponent implements OnInit {
  subscription: Subscription;
  billingHistory: BillingHistoryItem[];

  constructor(private store: Store<AppState>, private service: SettingsService) {
    this.subscription = store
      .select('state', 'settings', 'billingHistory')
      .subscribe(billingHistory => this.billingHistory = billingHistory);
  }

  ngOnInit() {
    this.store.dispatch(new settingsActions.LoadBillingHistory(''));
  };

}
