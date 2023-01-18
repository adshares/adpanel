import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { BillingHistory } from 'models/settings.model';
import { SettingsService } from 'settings/settings.service';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { DATE_FORMAT } from 'common/utilities/consts';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import {
  CANCEL_AWAITING_TRANSACTION,
  GetBillingHistory,
  WITHDRAW_FUNDS_SUCCESS,
} from 'store/settings/settings.actions';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ServerOptionsService } from 'common/server-options.service';

@Component({
  selector: 'app-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrls: ['./billing-history.component.scss'],
})
export class BillingHistoryComponent extends HandleSubscriptionComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  emptyBillingHistory: BillingHistory = {
    limit: 10,
    offset: 0,
    itemsCount: 0,
    itemsCountAll: 0,
    items: [],
  };
  billingHistory: BillingHistory = this.emptyBillingHistory;
  showLoader: boolean = true;
  refreshIcon = faSyncAlt;
  appCurrency: string;

  readonly DATE_FORMAT: string = DATE_FORMAT;
  dateFrom: Moment;
  dateTo: Moment;
  types: number[];

  constructor(
    private serverOptionsService: ServerOptionsService,
    private settingsService: SettingsService,
    private dialog: MatDialog,
    private action$: Actions,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit(): void {
    this.appCurrency = this.serverOptionsService.getOptions().appCurrency;
    const handleHistoryUpdate = this.action$
      .pipe(ofType(CANCEL_AWAITING_TRANSACTION, WITHDRAW_FUNDS_SUCCESS))
      .subscribe(() => this.getBillingHistory());
    this.subscriptions.push(handleHistoryUpdate);

    this.dateFrom = moment().subtract(30, 'days').startOf('day');
    this.dateTo = moment().endOf('day');
    this.types = [];

    const dataSubscription = this.store
      .select('state', 'user', 'settings', 'billingHistory')
      .subscribe(billingHistory => {
        this.billingHistory = billingHistory;
        this.showLoader = false;
      });
    this.subscriptions.push(dataSubscription);
    this.getBillingHistory();
  }

  getBillingHistory(limit?: number, offset?: number): void {
    this.showLoader = true;
    this.store.dispatch(
      new GetBillingHistory({
        dateFrom: this.dateFrom.format(),
        dateTo: this.dateTo.format(),
        types: this.types,
        limit,
        offset,
      })
    );
  }

  handlePaginationEvent(event: any): void {
    const limit = event.pageSize;
    const offset = event.pageIndex * limit;
    this.getBillingHistory(limit, offset);
  }

  refresh(): void {
    this.paginator.firstPage();
    this.getBillingHistory();
  }

  updateFilterData($event): void {
    this.dateFrom = $event.from;
    this.dateTo = $event.to;
    this.types = $event.types;

    this.refresh();
  }
}
