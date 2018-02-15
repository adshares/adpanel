import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartService } from '../../common/chart.service';
import { ChartComponent } from '../../common/components/chart/chart.component';

import { HandleSubscription } from '../../common/handle-subscription';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends HandleSubscription implements OnInit {
  @ViewChild(ChartComponent) appChartRef: ChartComponent;

  currentChartFilterSettings = {
    currentTo: moment().format(),
    currentFrom: moment().subtract(30, 'days').format(),
    currentFrequency: '1D',
    currentAssetId: 1,
    currentSeries: 'series'
  };

  barChartValue: number;
  barChartDifference: number;
  barChartDifferenceInPercentage: number;

  barChartLabels = [
    {
      labels: []
    },
    {
      labels: []
    },
    {
      labels: []
    }
  ];
  barChartData: any[] = [
    [{
      data: []
    }],
    [{
      data: []
    }],
    [{
      data: []
    }]
  ];

  constructor(private chartService: ChartService) {
    super(null);
  }

  ngOnInit() {
    this.getChartData(this.currentChartFilterSettings);
  }

  getChartData(chartFilterSettings) {
    this.barChartData.forEach(values => values[0].data = [] );

    const chartDataSubscription = this.chartService
      .getAssetChartData(
        chartFilterSettings.from,
        chartFilterSettings.to,
        chartFilterSettings.frequency,
        chartFilterSettings.assetId,
        chartFilterSettings.series
      )
      .subscribe(data => {
        this.barChartData.forEach(values => values[0].data = data.values );
        this.barChartLabels.forEach(chartLabels => {
          chartLabels.labels = data.timestamps.map(timestamp => moment(timestamp).format('D'));
        });
        this.barChartValue = data.total;
        this.barChartDifference = data.difference;
        this.barChartDifferenceInPercentage = data.differenceInPercentage;
      });

    this.subscriptions.push(chartDataSubscription);
  }
}
