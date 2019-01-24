import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {Store} from '@ngrx/store';

import {User} from 'models/user.model';
import {AppState} from 'models/app-state.model';
import {adminChartSeriesEnum, advChartSeriesEnum, pubChartSeriesEnum} from 'models/enum/chart.enum';
import {enumToArray} from 'common/utilities/helpers';
import {HandleSubscription} from 'common/handle-subscription';
import {Site} from "models/site.model";
import {Router} from "@angular/router";

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
  currentAssetSeries: string = enumToArray(advChartSeriesEnum)[0];
  currentAdminAssetSeries: string = enumToArray(adminChartSeriesEnum)[0];
  chartSeries: string[];
  assetsInfo: AssetInfo[];

  constructor(private store: Store<AppState>, private router: Router) {
    super();
  }

  ngOnInit() {
    const userDataSubscription = this.store.select('state', 'user', 'data')
      .subscribe(userData => {
        this.userData = userData;
        this.userData.isPublisher =  !!this.router.url.match('/publisher/');
        this.userData.isAdvertiser =  !!this.router.url.match('/advertiser/');
        this.setInitialDataByUserType();
      });

    this.subscriptions.push(userDataSubscription);
  }

  setInitialDataByUserType() {
    if (this.userData.isAdvertiser) {
       this.chartSeries =  enumToArray(advChartSeriesEnum);
      const userCampaignsSubscription = this.store.select('state', 'advertiser', 'campaigns')
        .subscribe((campaigns) => {
          this.assetsInfo = campaigns.map(
            campaign => {
              return {id: campaign.id, name: campaign.basicInformation.name}
            }
          );
          this.assetsInfo.unshift({id: 0, name: 'All Campaigns'});
        });
      this.subscriptions.push(userCampaignsSubscription);
    } else if (this.userData.isPublisher) {

      this.chartSeries =  enumToArray(pubChartSeriesEnum);
      const userCampaignsSubscription = this.store.select('state', 'publisher', 'sites')
        .subscribe((sites: Site[]) => {
          this.assetsInfo = sites.map(
            site => {
              return {id: site.id, name: site.name}
            }
          );
          this.assetsInfo.unshift({id: 0, name: 'All Sites'});
        });
      this.subscriptions.push(userCampaignsSubscription);
    } else {
      this.chartSeries =  enumToArray(advChartSeriesEnum);
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
