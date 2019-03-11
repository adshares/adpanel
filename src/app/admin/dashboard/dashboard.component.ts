import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

import { AppState } from 'models/app-state.model';
import { ChartService } from 'common/chart.service';
import { ChartComponent } from 'common/components/chart/chart.component';
import { ChartFilterSettings } from 'models/chart/chart-filter-settings.model';
import { ChartData } from 'models/chart/chart-data.model';
import { HandleSubscription } from 'common/handle-subscription';
import { createInitialArray } from 'common/utilities/helpers';
import { fadeAnimation } from "common/animations/fade.animation";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [fadeAnimation]
})
export class DashboardComponent extends HandleSubscription implements OnInit {
  @ViewChild(ChartComponent) appChartRef: ChartComponent;

  barChartValue: number;
  barChartDifference: number;
  barChartDifferenceInPercentage: number;
  barChartLabels: any = createInitialArray({labels: []}, 3);
  barChartData: ChartData[][] = createInitialArray([{data: []}], 3);

  currentChartFilterSettings: ChartFilterSettings;

  settings = [
    {
      title: 'Account Settings',
      description: '',
      link: '/admin/dashboard/general',
      values: [
        {name: 'Email & Password', icon: 'assets/images/preferences.svg'},
      ],
      admin: true,
    },
    {
      title: 'Earnings Settings',
      description: '',
      link: '/admin/dashboard/earnings',
      values: [
        {name: 'Set your earnings', icon: 'assets/images/wallet--gray.svg'},
      ],
      admin: true,
    }, {
      title: 'Params Settings',
      description: '',
      link: '/admin/dashboard/params',
      values: [
        {name: 'Set your params', icon: 'assets/images/preferences.svg'},
      ],
      admin: true,
    }
  ];

  constructor(
    private chartService: ChartService,
    private store: Store<AppState>,
  ) {
    super();
  }

  getRouterOutletState = (outlet) => {
    console.log(outlet)
    return outlet.isActivated ? outlet.activatedRoute : ''};

  ngOnInit() {
    const chartFilterSubscription = this.store.select('state', 'common', 'chartFilterSettings')
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.currentChartFilterSettings = chartFilterSettings;
      });
    this.subscriptions.push(chartFilterSubscription);

    this.getChartData(this.currentChartFilterSettings);
  }

  getChartData(chartFilterSettings) {
    this.barChartData.forEach(values => values[0].data = []);

    const chartDataSubscription = this.chartService
      .getAssetChartData(
        chartFilterSettings.from,
        chartFilterSettings.to,
        chartFilterSettings.frequency,
        chartFilterSettings.series,
        'campaigns'
      )
      .subscribe(data => {
        this.barChartData.forEach(values => values[0].data = data.values);
        this.barChartData.forEach(chartData => chartData[0].currentSeries = this.currentChartFilterSettings.currentSeries);
        this.barChartLabels.forEach(chartLabels => {
          chartLabels.labels = data.timestamps.map(timestamp => moment(timestamp).format('D'));
          chartLabels.labels.fullLabels = data.timestamps.map(timestamp => moment(timestamp).format('DD MMM YYYY'));
        });
        this.barChartValue = data.total;
        this.barChartDifference = data.difference;
        this.barChartDifferenceInPercentage = data.differenceInPercentage;
      });

    this.subscriptions.push(chartDataSubscription);
  }
}
