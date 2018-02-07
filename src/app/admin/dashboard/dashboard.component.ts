import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SetYourEarningsDialogComponent } from '../dialogs/set-your-earnings-dialog/set-your-earnings-dialog.component';
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
  @ViewChild('appChartRef') appChartRef: ChartComponent;

  currentTo = moment().format();
  currentFrom = moment().subtract(30, 'days').format();
  currentFrequency = '1D';
  currentAssetId = 0;
  currentSeries = 'saldo';

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

  constructor(
    private chartService: ChartService,
    private dialog: MatDialog
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
        this.barChartData.forEach(values => {
          console.log(values)
          values[0].data = data.values;
        });
        this.barChartLabels.forEach(labels => {
          labels.labels = data.timestamps.map(timestamp => moment(timestamp).format('D'));
        });
        console.log(this.barChartLabels);
        console.log(this.barChartData);
        this.barChartValue = data.total;
        this.barChartDifference = data.difference;
        this.barChartDifferenceInPercentage = data.differenceInPercentage;
      });

    this.subscriptions.push(chartDataSubscription);
  }

  updateChartData(daysBack) {
    this.barChartData[0].data = [];
    this.currentFrom = moment().subtract(daysBack, 'days').format()
    this.getChartData(this.currentFrom, this.currentTo, this.currentFrequency, this.currentAssetId, this.currentSeries);
  }

  updateChartDataByDatepicker(timespan) {
    this.currentFrom = timespan.from.value.format();
    this.currentTo = timespan.to.value.format();

    this.barChartData[0].data = [];
    this.getChartData(this.currentFrom, this.currentTo, this.currentFrequency, this.currentAssetId, this.currentSeries);
  }
}
