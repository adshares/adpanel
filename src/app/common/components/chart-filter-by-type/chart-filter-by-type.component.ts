import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';

import { User } from 'models/user.model';
import { AppState } from 'models/app-state.model';
import { chartSeriesEnum } from 'models/enum/chart.enum';
import { adminChartSeriesEnum } from 'models/enum/chart.enum';
import { enumToArray } from 'common/utilities/helpers';
import { HandleSubscription } from 'common/handle-subscription';

interface AssetInfo {
  id: number;
  name: string;
}

@Component({
  selector: 'app-chart-filter-by-type',
  templateUrl: './chart-filter-by-type.component.html',
  styleUrls: ['./chart-filter-by-type.component.scss'],
})
export class ChartFilterByTypeComponent extends HandleSubscription implements OnInit {
  @Output() updateId: EventEmitter<number> = new EventEmitter();
  @Output() updateSeries: EventEmitter<string> = new EventEmitter();

  userData: User;

  currentAssetId = 0;
  currentAssetSeries: string = enumToArray(chartSeriesEnum)[0];
  currentAdminAssetSeries: string = enumToArray(adminChartSeriesEnum)[0];
  chartSeries: string[];
  assetsInfo: AssetInfo[];

  constructor(private store: Store<AppState>) {
    super();
  }

  ngOnInit() {
    const userDataSubscription = this.store.select('state', 'user', 'data')
      .subscribe(userData => this.userData = userData);
    this.subscriptions.push(userDataSubscription);

    this.setInitialDataByUserType();
  }

  setInitialDataByUserType() {
    this.chartSeries = this.userData.user.isAdmin ?
      enumToArray(adminChartSeriesEnum) : enumToArray(chartSeriesEnum);

    if (this.userData.user.isAdvertiser) {
      const userCampaignsSubscription = this.store.select('state', 'advertiser', 'campaigns')
        .subscribe((campaigns) => {
          this.assetsInfo = campaigns.map(
            campaign => ({id: campaign.id, name: campaign.basicInformation.name})
          );
          this.assetsInfo.unshift({id: 0, name: 'All Campaigns'});
        });
      this.subscriptions.push(userCampaignsSubscription);
    }
  }

  updateAssetId(event) {
    this.currentAssetId = event.value;
    this.updateId.emit(this.currentAssetId);
  }

  updateAssetSeries(event) {
    this.currentAssetSeries = event.value;
    this.updateSeries.emit(this.currentAssetSeries);
  }
}
