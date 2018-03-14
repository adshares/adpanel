import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

import { ChartService } from 'common/chart.service';
import { PublisherService } from 'publisher/publisher.service';
import { HandleSubscription } from 'common/handle-subscription';
import { AppState } from 'models/app-state.model';
import { Site } from 'models/site.model';
import { ChartFilterSettings } from 'models/chart/chart-filter-settings.model';
import { ChartLabels } from 'models/chart/chart-labels.model';
import { ChartData } from 'models/chart/chart-data.model';
import { AssetTargeting } from 'models/targeting-option.model';
import { createInitialArray, enumToObjectArray, selectCompare } from 'common/utilities/helpers';
import { enumToArray } from 'common/utilities/helpers';
import { chartSeriesEnum } from 'models/enum/chart-series.enum';
import { siteStatusEnum } from 'models/enum/site.enum';
import * as publisherActions from 'store/publisher/publisher.actions';

import { parseTargetingOtionsToArray } from 'common/components/targeting/targeting.helpers';

@Component({
  selector: 'app-site-details',
  templateUrl: './site-details.component.html',
  styleUrls: ['./site-details.component.scss'],
})
export class SiteDetailsComponent extends HandleSubscription implements OnInit {
  site: Site;
  targeting: AssetTargeting;

  chartSeries: string[] = enumToArray(chartSeriesEnum);

  siteStatuses = enumToObjectArray(siteStatusEnum);
  selectCompare = selectCompare;

  barChartValue: number;
  barChartDifference: number;
  barChartDifferenceInPercentage: number;
  barChartLabels: ChartLabels[] = createInitialArray({ labels: [] }, 6);
  barChartData: ChartData[][] = createInitialArray([{ data: [] }], 6);

  currentChartFilterSettings: ChartFilterSettings;

  constructor(
    private route: ActivatedRoute,
    private publisherService: PublisherService,
    private router: Router,
    private store: Store<AppState>,
    private chartService: ChartService
  ) {
    super(null);
  }

  ngOnInit() {
    this.site = this.route.snapshot.data.site;

    this.getTargeting();

    const chartFilterSubscription = this.store.select('state', 'common', 'chartFilterSettings')
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.currentChartFilterSettings = chartFilterSettings;
      });
    this.subscriptions.push(chartFilterSubscription);

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
        this.barChartData.forEach(values => values[0].data = data.values);
        this.barChartLabels.forEach(chartLabels => {
          chartLabels.labels = data.timestamps.map(timestamp => moment(timestamp).format('D'));
        });
        this.barChartValue = data.total;
        this.barChartDifference = data.difference;
        this.barChartDifferenceInPercentage = data.differenceInPercentage;
      });

    this.subscriptions.push(chartDataSubscription);
  }

  navigateToEditSite() {
    this.store.dispatch(new publisherActions.SetLastEditedSite(this.site));
    this.router.navigate(
      ['/publisher', 'create-site', 'summary'],
      { queryParams: { step: 4} }
    );
  }

  navigateToCreateAdUnits() {
    this.store.dispatch(new publisherActions.SetLastEditedSite(this.site));
    this.router.navigate(
      ['/publisher', 'create-site', 'create-ad-units'],
      { queryParams: { step: 3, summary: true} }
    );
  }

  saveSite() {
    this.publisherService.saveSite(this.site).subscribe();
  }

  getTargeting() {
    this.publisherService.getTargetingCriteria().subscribe(targeting => {
        this.targeting = parseTargetingOtionsToArray(this.site.targeting, targeting);
      });
  }
}
