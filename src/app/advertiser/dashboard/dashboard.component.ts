import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from '../../common/components/chart/chart.component';
import { ChartService } from '../../common/chart.service';

import { HandleSubscription } from '../../common/handle-subscription';
import { ChartFilterSettings} from '../../models/chart-filter-settings.model';
import { chartFilterSettingsInitialState } from '../../models/initial-state/chart-filter-settings';

import { cloneDeep } from '../../common/utilities/helpers';
import * as moment from 'moment';

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

  barChartLabels = [];
  barChartData: any[] = [{data: []}];

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
