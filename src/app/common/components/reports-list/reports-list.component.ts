import { Component, OnInit } from '@angular/core';
import { CommonService } from 'common/common.service';
import { HandleSubscription } from 'common/handle-subscription';
import { ReportsListItem } from 'models/settings.model';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss'],
})
export class ReportsListComponent extends HandleSubscription implements OnInit {
  reportsListAdvertiser: ReportsListItem[] = [];
  reportsListPublisher: ReportsListItem[] = [];

  constructor(
    private service: CommonService,
  ) {
    super();
  }

  ngOnInit(): void {
    const subscription = this.service.getReportsList().subscribe(
      response => {
        this.reportsListAdvertiser = response.advertiser || [];
        this.reportsListPublisher = response.publisher || [];
      },
      () => this.reportsListAdvertiser = [],
    );
    this.subscriptions.push(subscription);
  }
}
