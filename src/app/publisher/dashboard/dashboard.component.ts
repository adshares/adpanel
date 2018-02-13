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
  @ViewChild('appChartRef') appChartRef: ChartComponent;
  chartSeries: string[] = enumToArray(chartSeriesEnum);
  currentTo = moment().format();
  currentFrom = moment().subtract(30, 'days').format();
  currentFrequency = '1D';
  currentAssetId = 0;

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

  constructor(
    private chartService: ChartService,
  ) {
    super(null);
  }

  ngOnInit() {
    this.getChartData(
      this.currentFrom,
      this.currentTo,
      this.currentFrequency,
      this.currentAssetId
    );
  }

  getChartData(
    from,
    to,
    frequency,
    assetId
  ) {
    const chartDataSubscription = this.chartService
      .getAssetChartDataForPublisher(
        from,
        to,
        frequency,
        assetId,
      )
      .subscribe(data => {
        this.barChartData.forEach(values => {
          values[0].data = data.values;
        });
        this.barChartLabels.forEach(labels => {
          labels.labels = data.timestamps.map(timestamp => moment(timestamp).format('D'));
        });
        this.barChartValue = data.total;
        this.barChartDifference = data.difference;
        this.barChartDifferenceInPercentage = data.differenceInPercentage;
      });

    this.subscriptions.push(chartDataSubscription);
  }

  updateChartData(daysBack) {
    this.barChartData[0].data = [];
    this.currentFrom = moment().subtract(daysBack, 'days').format();
    switch (daysBack) {
      case '1':
        return this.currentFrequency = 'hours';
      case '7':
        return this.currentFrequency = 'quarters';
      case '30':
        return this.currentFrequency = 'days';
    }
    this.getChartData(this.currentFrom, this.currentTo, this.currentFrequency, this.currentAssetId);
  }

  updateChartDataByDatepicker(timespan) {
    this.currentFrom = timespan.from.value.format();
    this.currentTo = timespan.to.value.format();

    const daysSpan = moment(this.currentTo).diff(moment(this.currentFrom), 'days');

    if (daysSpan <= 1) {
      return this.currentFrequency = 'hours';
    } else if (daysSpan <= 7) {
      return this.currentFrequency = 'quarters';
    } else if (daysSpan <= 31) {
      return this.currentFrequency = 'days';
    } else {
      // return last 30?
    }

    this.barChartData[0].data = [];
    this.getChartData(this.currentFrom, this.currentTo, this.currentFrequency, this.currentAssetId);
  }
}
