import {Component, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import * as moment from 'moment';

import {ChartService} from 'common/chart.service';
import {ChartComponent} from 'common/components/chart/chart.component';
import {SiteListComponent} from 'publisher/site-list/site-list.component';
import {HandleSubscription} from 'common/handle-subscription';
import {Site, SitesTotals} from 'models/site.model';
import {chartSeriesEnum} from 'models/enum/chart.enum';
import {ChartFilterSettings} from 'models/chart/chart-filter-settings.model';
import {ChartData} from 'models/chart/chart-data.model';
import {ChartLabels} from 'models/chart/chart-labels.model';
import {AppState} from 'models/app-state.model';
import {createInitialArray, enumToArray} from 'common/utilities/helpers';

import * as publisherActions from 'store/publisher/publisher.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends HandleSubscription implements OnInit {
  @ViewChild(ChartComponent) appChartRef: ChartComponent;
  @ViewChild(SiteListComponent) campaignListRef: SiteListComponent;

  sites: Site[];
  sitesTotals: SitesTotals;

  chartSeries: string[] = enumToArray(chartSeriesEnum);

  barChartValue: number;
  barChartDifference: number;
  barChartDifferenceInPercentage: number;
  barChartLabels: string[] = [];
  barChartData: ChartData[] = createInitialArray([{data: []}], 1);
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

    this.loadSites(this.currentChartFilterSettings.currentFrom, this.currentChartFilterSettings.currentTo);
    this.getChartData(this.currentChartFilterSettings);
    this.userHasConfirmedEmail = this.store.select('state', 'user', 'data', 'isEmailConfirmed');
  }

  getChartData(chartFilterSettings) {
    // this.barChartData.forEach(values => values[0].data = []);
    this.barChartData[0].data = [];
    console.log(chartFilterSettings.currentAssetId)
    const chartDataSubscription = this.chartService
      .getAssetChartData(
        chartFilterSettings.currentFrom,
        chartFilterSettings.currentTo,
        chartFilterSettings.currentFrequency,
        chartFilterSettings.currentSeries,
        'sites',
        chartFilterSettings.currentAssetId,
      )
      .subscribe(data => {
        console.log('data', data)
        this.barChartData[0].data = data.values;

        this.barChartLabels = data.timestamps.map(item => moment(item).format());
        this.barChartValue = data.total;
        this.barChartDifference = data.difference;
        this.barChartDifferenceInPercentage = data.differenceInPercentage;
      });

    this.store.dispatch(new publisherActions.LoadSitesTotals({
      from: chartFilterSettings.currentFrom,
      to: chartFilterSettings.currentTo
    }));

    this.subscriptions.push(chartDataSubscription);
  }

  loadSites(from, to) {
    from = moment(from).format();
    to = moment(to).format();
    this.store.dispatch(new publisherActions.LoadSites({from, to}));
    this.store.dispatch(new publisherActions.LoadSitesTotals({from, to}));

    const sitesSubscription = this.store.select('state', 'publisher', 'sites')
      .subscribe((sites: Site[]) => this.sites = sites);
    const sitesTotalsSubscription = this.store.select('state', 'publisher', 'sitesTotals')
      .subscribe((sitesTotals: SitesTotals) => this.sitesTotals = sitesTotals);

    this.subscriptions.push(sitesSubscription, sitesTotalsSubscription);
  }
}
