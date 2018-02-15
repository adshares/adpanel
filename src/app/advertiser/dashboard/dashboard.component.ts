import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from '../../common/components/chart/chart.component';
import { ChartService } from '../../common/chart.service';

import { HandleSubscription } from '../../common/handle-subscription';
import { ChartFilterSettings} from '../../models/chart/chart-filter-settings.model';
import { chartFilterSettingsInitialState } from '../../models/initial-state/chart-filter-settings';

import * as moment from 'moment';
import { cloneDeep, createInitialArray } from '../../common/utilities/helpers';
import { ChartData } from '../../models/chart/chart-data.model';

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
  barChartLabels: string[] = [];
  barChartData: ChartData[] = createInitialArray([{ data: [] }], 1);

  currentChartFilterSettings: ChartFilterSettings = cloneDeep(chartFilterSettingsInitialState);

  constructor(
    private chartService: ChartService,
  ) {
    super(null);
  }

  ngOnInit() {
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
}
