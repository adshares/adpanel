import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

import { Campaign } from 'models/campaign.model';
import { AppState } from 'models/app-state.model';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { ChartComponent } from 'common/components/chart/chart.component';
import { ChartService } from 'common/chart.service';
import { ChartFilterSettings } from 'models/chart/chart-filter-settings.model';
import { ChartData } from 'models/chart/chart-data.model';
import { campaignStatusesEnum } from 'models/enum/campaign.enum';
import { createInitialArray } from 'common/utilities/helpers';
import { HandleSubscription } from 'common/handle-subscription';
import * as advertiserActions from 'store/advertiser/advertiser.actions';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss']
})
export class CampaignDetailsComponent extends HandleSubscription implements OnInit {
  @ViewChild(ChartComponent) appChartRef: ChartComponent;

  campaign: Campaign;
  campaignStatusesEnum = campaignStatusesEnum;

  barChartValue: number;
  barChartDifference: number;
  barChartDifferenceInPercentage: number;
  barChartLabels: string[] = [];
  barChartData: ChartData[] = createInitialArray([{ data: [] }], 1);

  currentChartFilterSettings: ChartFilterSettings;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private advertiserService: AdvertiserService,
    private chartService: ChartService
  ) {
    super();
  }

  ngOnInit() {
    this.campaign = this.route.snapshot.data.campaign;

    const chartFilterSubscription = this.store.select('state', 'common', 'chartFilterSettings')
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.currentChartFilterSettings = chartFilterSettings;
      });
    this.subscriptions.push(chartFilterSubscription);

    this.getChartData(this.currentChartFilterSettings);
  }

  getChartData(chartFilterSettings) {
    this.barChartData[0].data = [];

    const chartDataSubscription = this.chartService
      .getAssetChartData(
        chartFilterSettings.from,
        chartFilterSettings.to,
        chartFilterSettings.frequency,
        chartFilterSettings.assetId,
        chartFilterSettings.series
      )
      .subscribe(data => {
        this.barChartData[0].data = data.values;
        this.barChartLabels = data.timestamps.map((item) => moment(item).format('D'));
        this.barChartValue = data.total;
        this.barChartDifference = data.difference;
        this.barChartDifferenceInPercentage = data.differenceInPercentage;
      });

    this.subscriptions.push(chartDataSubscription);
  }

  navigateToEditCampaign() {
    this.store.dispatch(new advertiserActions.SetLastEditedCampaign(this.campaign));
    this.router.navigate(
      ['/advertiser', 'create-campaign', 'summary'],
      { queryParams: { step: 4} }
    );
  }

  navigateToCreateAd() {
    this.store.dispatch(new advertiserActions.SetLastEditedCampaign(this.campaign));
    this.router.navigate(
      ['/advertiser', 'create-campaign', 'create-ad'],
      { queryParams: { step: 3, summary: true} }
    );
  }

  onCampaignStatusChange(status) {
    const statusActive = status !== this.campaignStatusesEnum.ACTIVE;

    this.campaign.basicInformation.status =
      statusActive ? this.campaignStatusesEnum.ACTIVE : this.campaignStatusesEnum.INACTIVE;

    this.advertiserService.saveCampaign(this.campaign);
  }
}
