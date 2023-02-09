import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { CommonService } from 'common/common.service';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { ReportsListItem } from 'models/settings.model';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
})
export class ReportsListComponent extends HandleSubscriptionComponent implements OnInit {
  private readonly REFRESH_PERIOD = 2000;

  reportsListAdvertiser: ReportsListItem[] = [];
  reportsListPublisher: ReportsListItem[] = [];
  reportListLoaded: boolean = false;

  constructor(private service: CommonService) {
    super();
  }

  ngOnInit(): void {
    const subscription = timer(0, this.REFRESH_PERIOD).subscribe(() =>
      this.service
        .getReportsList()
        .pipe(take(1))
        .subscribe(
          response => {
            this.reportsListAdvertiser = response.advertiser || [];
            this.reportsListPublisher = response.publisher || [];
            this.reportListLoaded = true;
          },
          () => (this.reportListLoaded = true)
        )
    );

    this.subscriptions.push(subscription);
  }
}
