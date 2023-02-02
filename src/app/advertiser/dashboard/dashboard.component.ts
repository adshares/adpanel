import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import { ChartComponent } from 'common/components/chart/chart.component';
import { mapDatesToChartLabels } from 'common/components/chart/chart-settings/chart-settings.helpers';
import { ChartService } from 'common/chart.service';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { Campaign, CampaignTotals } from 'models/campaign.model';
import { AppState } from 'models/app-state.model';
import { ChartFilterSettings } from 'models/chart/chart-filter-settings.model';
import { createInitialDataSet } from 'common/utilities/helpers';
import { LoadCampaigns, LoadCampaignsTotals } from 'store/advertiser/advertiser.actions';
import { appSettings } from 'app-settings';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { RequestReport } from 'store/common/common.actions';
import { reportType } from 'models/enum/user.enum';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends HandleSubscriptionComponent implements OnInit {
  @ViewChild(ChartComponent) appChartRef: ChartComponent;

  campaigns: Campaign[];
  campaignsLoaded: boolean = false;
  campaignsTotals: CampaignTotals;
  dataLoaded: boolean = false;

  barChartValue: number;
  barChartDifference: number;
  barChartDifferenceInPercentage: number;
  barChartLabels: string[] = [];
  barChartData = createInitialDataSet();

  currentChartFilterSettings: ChartFilterSettings;
  faPlusCircle = faPlusCircle;

  constructor(private chartService: ChartService, private store: Store<AppState>) {
    super();
  }

  ngOnInit() {
    const chartFilterSubscription = this.store
      .select('state', 'common', 'chartFilterSettings')
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.currentChartFilterSettings = chartFilterSettings;
      });

    this.loadCampaigns(this.currentChartFilterSettings.currentFrom, this.currentChartFilterSettings.currentTo);
    this.getChartData(this.currentChartFilterSettings);

    const refreshSubscription = timer(
      appSettings.AUTOMATIC_REFRESH_INTERVAL,
      appSettings.AUTOMATIC_REFRESH_INTERVAL
    ).subscribe(() => {
      if (this.currentChartFilterSettings) {
        this.getChartData(this.currentChartFilterSettings, false);
        this.store.dispatch(
          new LoadCampaignsTotals({
            from: this.currentChartFilterSettings.currentFrom,
            to: this.currentChartFilterSettings.currentTo,
          })
        );
      }
    });

    this.subscriptions.push(chartFilterSubscription, refreshSubscription);
  }

  getChartData(chartFilterSettings, reload: boolean = true) {
    if (reload) {
      this.barChartData[0].data = [];
    }

    this.chartService
      .getAssetChartData(
        chartFilterSettings.currentFrom,
        chartFilterSettings.currentTo,
        chartFilterSettings.currentFrequency,
        chartFilterSettings.currentSeries.value,
        'campaigns',
        chartFilterSettings.currentAssetId
      )
      .pipe(take(1))
      .subscribe(data => {
        this.barChartData[0].data = data.values;
        this.barChartData[0].label = chartFilterSettings.currentSeries.label;
        this.barChartLabels = mapDatesToChartLabels(data.timestamps);
        this.barChartValue = data.total;
        this.barChartDifference = data.difference;
        this.barChartDifferenceInPercentage = data.differenceInPercentage;
      });
  }

  loadCampaigns(from: string, to: string) {
    this.store.dispatch(new LoadCampaigns({ from, to }));

    const campaignsSubscription = this.store
      .select('state', 'advertiser', 'campaigns')
      .subscribe((campaigns: Campaign[]) => (this.campaigns = campaigns));

    const campaignsLoadedSubscription = this.store
      .select('state', 'advertiser', 'campaignsLoaded')
      .subscribe((campaignsLoaded: boolean) => (this.campaignsLoaded = campaignsLoaded));

    const campaignsTotalsSubscription = this.store
      .select('state', 'advertiser', 'campaignsTotals')
      .subscribe((totals: CampaignTotals) => (this.campaignsTotals = totals));

    const dataLoadedSubscription = this.store
      .select('state', 'advertiser', 'dataLoaded')
      .subscribe((dataLoaded: boolean) => (this.dataLoaded = dataLoaded));

    this.subscriptions.push(
      campaignsSubscription,
      campaignsLoadedSubscription,
      campaignsTotalsSubscription,
      dataLoadedSubscription
    );
  }

  downloadReport() {
    this.store.dispatch(
      new RequestReport({
        type: reportType.CAMPAIGNS,
        dateStart: this.currentChartFilterSettings.currentFrom,
        dateEnd: this.currentChartFilterSettings.currentTo,
      })
    );
  }
}
