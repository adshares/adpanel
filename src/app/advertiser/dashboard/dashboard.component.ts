import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from '../../common/components/chart/chart.component';
import { ChartService } from '../../common/chart.service';

import { HandleSubscription } from '../../common/handle-subscription';

import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends HandleSubscription implements OnInit {
  @ViewChild('appChartRef') appChartRef: ChartComponent;

  barChartValue: 20;
  barChartDifference: number;
  barChartDifferenceInPercentage: number;

  barChartLabels = [];
  barChartData: any[] = [{data: []}];

  currentTo = moment().format();
  currentFrom = moment().subtract(30, 'days').format();
  currentFrequency = '1D';
  currentAssetId = 1;
  currentSeries = 'clicks';

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
      this.currentAssetId,
      this.currentSeries
    );
  }

  getChartData(
    from,
    to,
    frequency,
    assetId,
    series
  ) {
    const chartDataSubscription = this.chartService
      .getAssetChartData(
        from,
        to,
        frequency,
        assetId,
        series
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

  updateChartData(daysBack) {
    this.barChartData[0].data = [];
    this.currentFrom = moment().subtract(daysBack, 'days').format();
    this.getChartData(this.currentFrom, this.currentTo, this.currentFrequency, this.currentAssetId, this.currentSeries);
  }

  updateChartDataByDatepicker(timespan) {
    this.currentFrom = timespan.from.value.format();
    this.currentTo = timespan.to.value.format();

    this.barChartData[0].data = [];
    this.getChartData(this.currentFrom, this.currentTo, this.currentFrequency, this.currentAssetId, this.currentSeries);
  }

  updateChartDataSeries(series) {
    this.currentSeries = series;
    this.barChartData[0].data = [];
    this.getChartData(this.currentFrom, this.currentTo, this.currentFrequency, this.currentAssetId, this.currentSeries);
  }

  updateChartDataCampaign(assetId) {
    this.currentAssetId = assetId;
    this.barChartData[0].data = [];
    this.getChartData(this.currentFrom, this.currentTo, this.currentFrequency, this.currentAssetId, this.currentSeries);
  }
}
