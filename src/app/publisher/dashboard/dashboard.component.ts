import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

import { ChartService } from 'common/chart.service';
import { ChartComponent } from 'common/components/chart/chart.component';
import { SiteListComponent } from 'publisher/site-list/site-list.component';
import { HandleSubscription } from 'common/handle-subscription';
import { Site, SitesTotals } from 'models/site.model';
import { ChartFilterSettings } from 'models/chart/chart-filter-settings.model';
import { ChartData } from 'models/chart/chart-data.model';
import { AppState } from 'models/app-state.model';
import { createInitialArray, downloadCSVFile } from 'common/utilities/helpers';
import { PublisherService } from 'publisher/publisher.service';

import * as publisherActions from 'store/publisher/publisher.actions';
import { appSettings } from 'app-settings';
import { timer } from 'rxjs/observable/timer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends HandleSubscription implements OnInit {
  @ViewChild(ChartComponent) appChartRef: ChartComponent;
  @ViewChild(SiteListComponent) siteListRef: SiteListComponent;

  sites: Site[];
  sitesLoaded: boolean = false;
  sitesTotals: SitesTotals;
  dataLoaded: boolean = false;

  barChartValue: number;
  barChartDifference: number;
  barChartDifferenceInPercentage: number;
  barChartLabels: string[] = [];
  barChartData: ChartData[] = createInitialArray([{data: []}], 1);
  userHasConfirmedEmail: Store<boolean>;

  currentChartFilterSettings: ChartFilterSettings;

  constructor(
    private chartService: ChartService,
    private store: Store<AppState>,
    private publisherService: PublisherService
  ) {
    super();
  }

  ngOnInit() {
    const chartFilterSubscription = this.store.select('state', 'common', 'chartFilterSettings')
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.currentChartFilterSettings = chartFilterSettings;
      });
    this.loadSites(this.currentChartFilterSettings.currentFrom, this.currentChartFilterSettings.currentTo);
    this.getChartData(this.currentChartFilterSettings);
    this.userHasConfirmedEmail = this.store.select('state', 'user', 'data', 'isEmailConfirmed');

    const refreshSubscription = timer(appSettings.AUTOMATIC_REFRESH_INTERVAL, appSettings.AUTOMATIC_REFRESH_INTERVAL)
      .subscribe(() => {
        if (this.currentChartFilterSettings) {
          this.getChartData(this.currentChartFilterSettings, false);
          this.store.dispatch(new publisherActions.LoadSitesTotals({
            from: this.currentChartFilterSettings.currentFrom,
            to: this.currentChartFilterSettings.currentTo,
          }));
        }
      });

    this.subscriptions.push(chartFilterSubscription, refreshSubscription);
  }

  getChartData(chartFilterSettings, reload: boolean = true) {
    if (reload) {
      this.barChartData[0].data = [];
    }

    this.chartService
      .getAssetChartData(
        chartFilterSettings.currentFrom,
        chartFilterSettings.currentTo,
        chartFilterSettings.currentFrequency,
        chartFilterSettings.currentSeries.value,
        'sites',
        chartFilterSettings.currentAssetId,
      )
      .take(1)
      .subscribe(data => {
        this.barChartData[0].data = data.values;
        this.barChartData[0].currentSeries = chartFilterSettings.currentSeries.label;
        this.barChartLabels = data.timestamps.map(item => moment(item).format());
        this.barChartValue = data.total;
        this.barChartDifference = data.difference;
        this.barChartDifferenceInPercentage = data.differenceInPercentage;
      });
  }

  loadSites(from, to) {
    from = moment(from).format();
    to = moment(to).format();

    this.store.dispatch(new publisherActions.LoadSites({from, to}));

    const sitesSubscription = this.store.select('state', 'publisher', 'sites')
      .subscribe((sites: Site[]) => this.sites = sites);

    const sitesLoadedSubscription = this.store.select('state', 'publisher', 'sitesLoaded')
      .subscribe((sitesLoaded: boolean) => this.sitesLoaded = sitesLoaded);

    const sitesTotalsSubscription = this.store.select('state', 'publisher', 'sitesTotals')
      .subscribe((sitesTotals: SitesTotals) => this.sitesTotals = sitesTotals);

    const dataLoadedSubscription = this.store.select('state', 'publisher', 'dataLoaded')
      .subscribe((dataLoaded: boolean) => this.dataLoaded = dataLoaded);

    this.subscriptions.push(
      sitesSubscription,
      sitesLoadedSubscription,
      sitesTotalsSubscription,
      dataLoadedSubscription
    );
  }

  downloadReport() {
    const settings = this.currentChartFilterSettings;
    this.publisherService.report(settings.currentFrom, settings.currentTo)
      .subscribe((data) => {
        downloadCSVFile(data, settings.currentFrom, settings.currentTo);
      });
  }
}
