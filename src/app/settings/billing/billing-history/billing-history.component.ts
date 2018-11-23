import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {MatDialog} from "@angular/material";
import {Subscription} from 'rxjs/Subscription';
import {Store} from '@ngrx/store';

import {AppState} from 'models/app-state.model';
import {billingHistoryInitialState} from "models/initial-state/billing-history";
import {BillingHistory} from 'models/settings.model';
import {SettingsService} from "settings/settings.service";
import * as settingsActions from 'store/settings/settings.actions';
import * as codes from "common/utilities/codes";
import {ErrorResponseDialogComponent} from "common/dialog/error-response-dialog/error-response-dialog.component";

@Component({
  selector: 'app-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrls: ['./billing-history.component.scss'],
})
export class BillingHistoryComponent implements OnInit {
  subscription: Subscription;
  billingHistory: BillingHistory;
  showLoader: boolean = true;

  constructor(private store: Store<AppState>, private settingsService: SettingsService, private dialog: MatDialog) {
    this.subscription = store
      .select('state', 'user', 'settings', 'billingHistory')
      .subscribe(billingHistory => this.billingHistory = billingHistory);
  }

  ngOnInit() {
    this.showLoader = null === this.billingHistory;
    this.store.dispatch(new settingsActions.LoadBillingHistory(''));
  };

  handlePage(event: any): void {
    this.showLoader = true;
    const limit = event.pageSize;
    const offset = event.pageIndex * limit;
    this.settingsService.getBillingHistory(limit, offset)
      .subscribe(
        (billingHistory: BillingHistory) => {
          this.billingHistory = billingHistory;
          this.showLoader = false;
        },
        (err: HttpErrorResponse) => {
          if (err.status !== codes.HTTP_INTERNAL_SERVER_ERROR) {
            this.dialog.open(ErrorResponseDialogComponent, {
              data: {
                title: `Error during history fetch`,
                message: `Please, try again later.`,
              }
            });
          }
          this.billingHistory = billingHistoryInitialState;
          this.showLoader = false;
        }
      );
  }
}
