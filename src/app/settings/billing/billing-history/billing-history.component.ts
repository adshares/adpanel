import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from "@angular/common/http";
import { MatDialog, MatPaginator } from "@angular/material";
import { BillingHistory } from 'models/settings.model';
import { SettingsService } from "settings/settings.service";
import * as codes from "common/utilities/codes";
import { ErrorResponseDialogComponent } from "common/dialog/error-response-dialog/error-response-dialog.component";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { Store } from "@ngrx/store";
import { AppState } from "models/app-state.model";
import { GetBillingHistory, GetBillingHistoryFailure } from "store/settings/settings.actions";
import { HandleSubscription } from "common/handle-subscription";

@Component({
  selector: 'app-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrls: ['./billing-history.component.scss'],
})
export class BillingHistoryComponent extends HandleSubscription implements OnInit {
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

  constructor(private settingsService: SettingsService, private dialog: MatDialog,
              private store: Store<AppState>) {
    super();
  }

  ngOnInit() {
    const dataSubscription = this.store.select('state', 'user', 'settings', 'billingHistory')
      .subscribe( (billingHistory) => {
        this.billingHistory = billingHistory;
        this.showLoader = false;
      });
    this.subscriptions.push(dataSubscription);
    this.getBillingHistory();
  };

  getBillingHistory(limit?: number, offset?: number): void {
    this.showLoader = true;
    this.store.dispatch(new GetBillingHistory({limit, offset}));
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
}
