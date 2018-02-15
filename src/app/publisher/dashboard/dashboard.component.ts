import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartService } from '../../common/chart.service';
import { ChartComponent } from '../../common/components/chart/chart.component';

import { HandleSubscription } from '../../common/handle-subscription';
import { chartSeriesEnum } from '../../models/enum/chart-series.enum';
import { enumToArray } from '../../common/utilities/helpers';

import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends HandleSubscription implements OnInit {
  @ViewChild(ChartComponent) appChartRef: ChartComponent;
  chartSeries: string[] = enumToArray(chartSeriesEnum);

  currentChartFilterSettings = {
    currentTo: moment().format(),
    currentFrom: moment().subtract(30, 'days').format(),
    currentFrequency: '1D',
    currentAssetId: 1
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
    },
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
    }],
    [{
      data: []
    }],
    [{
      data: []
    }],
    [{
      data: []
    }],
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
      .getAssetChartDataForPublisher(
        chartFilterSettings.from,
        chartFilterSettings.to,
        chartFilterSettings.frequency,
        chartFilterSettings.assetId
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
