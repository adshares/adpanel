import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators';

import { User } from 'models/user.model';
import { AppState } from 'models/app-state.model';
import { advChartSeriesEnum, pubChartSeriesEnum } from 'models/enum/chart.enum';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { Site } from 'models/site.model';
import { Router } from '@angular/router';
import { seriesType } from 'models/chart/chart-filter-settings.model';

interface AssetInfo {
  id: number;
  name: string;
}

@Component({
  selector: 'app-chart-filter-by-type',
  templateUrl: './chart-filter-by-type.component.html',
  styleUrls: ['./chart-filter-by-type.component.scss'],
})
export class ChartFilterByTypeComponent extends HandleSubscriptionComponent implements OnInit {
  @Output() updateId: EventEmitter<number> = new EventEmitter();
  @Output() updateSeries: EventEmitter<seriesType> = new EventEmitter();
  @Input() detailsPage: boolean;
  userData: User;
  currentAssetId = 0;
  currentAssetSeries: seriesType;
  chartSeries;
  assetsInfo: AssetInfo[];

  constructor(private store: Store<AppState>, private router: Router) {
    super();
  }

  ngOnInit(): void {
    const userDataSubscription = this.store
      .select('state', 'user', 'data')
      .pipe(first())
      .subscribe(userData => {
        this.userData = userData;
        this.setInitialDataByUserType();
      });
    this.subscriptions.push(userDataSubscription);
  }

  setInitialDataByUserType(): void {
    if (this.isAdvertiserFilter()) {
      this.setChartSeriesArray(advChartSeriesEnum);
      const userCampaignsSubscription = this.store.select('state', 'advertiser', 'campaigns').subscribe(campaigns => {
        this.assetsInfo = campaigns.map(campaign => {
          return { id: campaign.id, name: campaign.basicInformation.name };
        });
        this.assetsInfo.unshift({ id: 0, name: 'All Campaigns' });
      });
      this.subscriptions.push(userCampaignsSubscription);
    } else if (this.isPublisherFilter()) {
      this.setChartSeriesArray(pubChartSeriesEnum);
      const userSiteSubscription = this.store.select('state', 'publisher', 'sites').subscribe((sites: Site[]) => {
        this.assetsInfo = sites.map(site => {
          return { id: site.id, name: site.name };
        });
        this.assetsInfo.unshift({ id: 0, name: 'All Sites' });
      });
      this.subscriptions.push(userSiteSubscription);
    } else {
      this.setChartSeriesArray(advChartSeriesEnum);
    }
    this.currentAssetSeries = this.chartSeries[0];
  }

  private isAdvertiserFilter(): boolean {
    return null !== this.router.url.match('/advertiser/');
  }

  private isPublisherFilter(): boolean {
    return null !== this.router.url.match('/publisher/');
  }

  setChartSeriesArray(seriesEnum): void {
    this.chartSeries = Object.entries(seriesEnum).map(dataArr => {
      return {
        label: dataArr[1],
        value: dataArr[0],
      };
    });
  }

  updateAssetId(event): void {
    this.currentAssetId = event.value;
    this.updateId.emit(this.currentAssetId);
  }

  updateAssetSeries(event): void {
    this.currentAssetSeries = event.value;
    this.updateSeries.emit(this.currentAssetSeries);
  }
}
