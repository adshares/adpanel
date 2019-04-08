import {Component, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import * as moment from 'moment';

import {ChartComponent} from 'common/components/chart/chart.component';
import {CampaignListComponent} from 'advertiser/campaign-list/campaign-list.component';
import {ChartService} from 'common/chart.service';
import {HandleSubscription} from 'common/handle-subscription';
import {Campaign, CampaignTotals} from 'models/campaign.model';
import {AppState} from 'models/app-state.model';
import {ChartData} from 'models/chart/chart-data.model';
import {ChartFilterSettings} from 'models/chart/chart-filter-settings.model';
import {createInitialArray, downloadCSVFile} from 'common/utilities/helpers';
import { AdvertiserService } from 'advertiser/advertiser.service';

import * as advertiserActions from 'store/advertiser/advertiser.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends HandleSubscription implements OnInit {
  @ViewChild(ChartComponent) appChartRef: ChartComponent;
  @ViewChild(CampaignListComponent) campaignListRef: CampaignListComponent;

  campaigns: Campaign[];
  campaignsTotals: CampaignTotals;

  barChartValue: number;
  barChartDifference: number;
  barChartDifferenceInPercentage: number;
  barChartLabels: string[] = [];
  barChartData: ChartData[] = createInitialArray([{data: []}], 1);
  userHasConfirmedEmail: Store<boolean>;

  currentChartFilterSettings: ChartFilterSettings;

  constructor(
    private chartService: ChartService,
    private store: Store<AppState>,
    private advertiserService: AdvertiserService
  ) {
    super();
  }

  ngOnInit() {
    const chartFilterSubscription = this.store.select('state', 'common', 'chartFilterSettings')
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.currentChartFilterSettings = chartFilterSettings;
      });
    this.loadCampaigns(this.currentChartFilterSettings.currentFrom, this.currentChartFilterSettings.currentTo);

    this.subscriptions.push(chartFilterSubscription);
    this.getChartData(this.currentChartFilterSettings);
    this.userHasConfirmedEmail = this.store.select('state', 'user', 'data', 'isEmailConfirmed');
  }

  getChartData(chartFilterSettings) {
    this.barChartData[0].data = [];

    const chartDataSubscription = this.chartService
      .getAssetChartData(
        chartFilterSettings.currentFrom,
        chartFilterSettings.currentTo,
        chartFilterSettings.currentFrequency,
        chartFilterSettings.currentSeries,
        'campaigns',
        chartFilterSettings.currentAssetId,
      )
      .subscribe(data => {
        this.barChartData[0].data = data.values;
        this.barChartData[0].currentSeries = this.currentChartFilterSettings.currentSeries;

        this.barChartLabels = data.timestamps.map(item => moment(item).format());
        this.barChartValue = data.total;
        this.barChartDifference = data.difference;

        this.barChartDifferenceInPercentage = data.differenceInPercentage;
      });

    this.subscriptions.push(chartDataSubscription);
  }

  loadCampaigns(from: string, to: string) {
    this.store.dispatch(new advertiserActions.LoadCampaigns({from, to}));
    const campaignsSubscription = this.store.select('state', 'advertiser', 'campaigns')
      .subscribe((campaigns: Campaign[]) => {
        this.campaigns = campaigns;
      });

    const campaignsTotalsSubscription = this.store.select('state', 'advertiser', 'campaignsTotals')
      .subscribe((totals: CampaignTotals) => this.campaignsTotals = totals);

    this.subscriptions.push(campaignsSubscription, campaignsTotalsSubscription);
  }


  downloadReport() {
    const settings = this.currentChartFilterSettings;
    this.advertiserService.report(settings.currentFrom, settings.currentTo)
      .subscribe((data) => {
        downloadCSVFile(data, settings.currentFrom, settings.currentTo);
      });
  }
}
