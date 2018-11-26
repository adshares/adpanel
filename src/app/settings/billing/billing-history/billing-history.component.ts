import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {MatDialog} from "@angular/material";
import {BillingHistory} from 'models/settings.model';
import {SettingsService} from "settings/settings.service";
import * as codes from "common/utilities/codes";
import {ErrorResponseDialogComponent} from "common/dialog/error-response-dialog/error-response-dialog.component";

@Component({
  selector: 'app-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrls: ['./billing-history.component.scss'],
})
export class BillingHistoryComponent implements OnInit {
  emptyBillingHistory: BillingHistory = {
    limit: 10,
    offset: 0,
    itemsCount: 0,
    itemsCountAll: 0,
    items: [],
  };
  billingHistory: BillingHistory = this.emptyBillingHistory;
  showLoader: boolean = true;

  constructor(private settingsService: SettingsService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.getBillingHistory();
  };

  getBillingHistory(limit?: number, offset?: number): void {
    this.showLoader = true;

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
          this.billingHistory = this.emptyBillingHistory;
          this.showLoader = false;
        }
      );
  }

  handlePaginationEvent(event: any): void {
    const limit = event.pageSize;
    const offset = event.pageIndex * limit;
    this.getBillingHistory(limit, offset);
  }
}
