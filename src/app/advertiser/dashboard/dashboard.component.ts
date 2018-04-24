import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

import { ChartComponent } from 'common/components/chart/chart.component';
import { ChartService } from 'common/chart.service';
import { HandleSubscription } from 'common/handle-subscription';
import { AppState } from 'models/app-state.model';
import { ChartData } from 'models/chart/chart-data.model';
import { ChartFilterSettings} from 'models/chart/chart-filter-settings.model';
import { createInitialArray } from 'common/utilities/helpers';
import { ChartLabels } from 'models/chart/chart-labels.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends HandleSubscription implements OnInit {
  @ViewChild(ChartComponent) appChartRef: ChartComponent;

  barChartValue: number;
  barChartDifference: number;
  barChartDifferenceInPercentage: number;
  barChartLabels: any = [];
  barChartData: ChartData[] = createInitialArray([{ data: [] }], 1);
  userHasConfirmedEmail: Store<boolean>;

  currentChartFilterSettings: ChartFilterSettings;

  constructor(
    private chartService: ChartService,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit() {
    const chartFilterSubscription = this.store.select('state', 'common', 'chartFilterSettings')
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.currentChartFilterSettings = chartFilterSettings;
      });
    this.subscriptions.push(chartFilterSubscription);

    this.getChartData(this.currentChartFilterSettings);
    this.userHasConfirmedEmail = this.store.select('state', 'user', 'data', 'isEmailConfirmed');
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
        this.barChartData[0].currentSeries = this.currentChartFilterSettings.currentSeries;
        this.barChartLabels = data.timestamps.map(item => moment(item).format('D'));
        this.barChartLabels.fullLabels = data.timestamps.map(item => moment(item).format('DD MMM YYYY'));
        this.barChartValue = data.total;
        this.barChartDifference = data.difference;
        this.barChartDifferenceInPercentage = data.differenceInPercentage;
      });

    this.subscriptions.push(chartDataSubscription);
  }
}
