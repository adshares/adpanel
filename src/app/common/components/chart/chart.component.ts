import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { chartOptions } from './chart-settings/chart-settings';
import { AppState } from 'models/app-state.model';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { ChartFilterSettings } from 'models/chart/chart-filter-settings.model';
import { ChartDataset, ChartOptions } from 'chart.js';
import * as commonActions from 'store/common/common.actions';
import { chartSeriesInitialState } from 'models/initial-state/chart-filter-settings';
import { cloneDeep } from 'common/utilities/helpers';
import { ServerOptionsService } from 'common/server-options.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
})
export class ChartComponent extends HandleSubscriptionComponent implements OnInit, OnDestroy, OnChanges {
  @Input() chartSpan: string;
  @Input() barChartData: ChartDataset<'bar'>[];
  @Input() barChartLabels: string[];
  @Output() update: EventEmitter<ChartFilterSettings> = new EventEmitter();

  currentChartFilterSettings: ChartFilterSettings;
  barChartOptions: ChartOptions<'bar'>;
  static seriesType;

  constructor(private serverOptionsService: ServerOptionsService, private store: Store<AppState>) {
    super();
  }

  ngOnInit(): void {
    this.barChartOptions = chartOptions(this.serverOptionsService.getOptions().displayCurrency);

    const chartFilterSubscription = this.store
      .select('state', 'common', 'chartFilterSettings')
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.currentChartFilterSettings = cloneDeep(chartFilterSettings);
      });
    this.subscriptions.push(chartFilterSubscription);
  }

  ngOnChanges(): void {
    ChartComponent.seriesType = this.barChartData[0].label;
  }

  updateChartData(timespan) {
    const from = (this.currentChartFilterSettings.currentFrom = moment(timespan.from).startOf('day').format());
    const to = (this.currentChartFilterSettings.currentTo = moment(timespan.to).endOf('day').format());
    const daysSpan = moment(to).diff(moment(from), 'days');

    if (daysSpan <= 2) {
      this.currentChartFilterSettings.currentFrequency = 'hour';
    } else if (daysSpan <= 31) {
      this.currentChartFilterSettings.currentFrequency = 'day';
    } else if (daysSpan <= 182) {
      this.currentChartFilterSettings.currentFrequency = 'week';
    } else if (daysSpan <= 730) {
      this.currentChartFilterSettings.currentFrequency = 'month';
    } else {
      this.currentChartFilterSettings.currentFrequency = 'year';
    }

    this.updateCurrentFilterSettingsInStore();
    this.update.emit(this.currentChartFilterSettings);
  }

  updateChartDataSeries(series) {
    this.currentChartFilterSettings.currentSeries = series;
    this.updateCurrentFilterSettingsInStore();
    this.update.emit(this.currentChartFilterSettings);
  }

  updateChartDataAssetId(assetId) {
    this.currentChartFilterSettings.currentAssetId = assetId;
    this.updateCurrentFilterSettingsInStore();
    this.update.emit(this.currentChartFilterSettings);
  }

  updateCurrentFilterSettingsInStore() {
    this.store.dispatch(new commonActions.SetChartFilterSettings(this.currentChartFilterSettings));
  }

  resetSettings() {
    const reset = {
      ...this.currentChartFilterSettings,
      currentSeries: chartSeriesInitialState,
    };
    this.store.dispatch(new commonActions.SetChartFilterSettings(reset));
  }

  ngOnDestroy() {
    this.resetSettings();
    const tooltip = document.getElementById('chartjs-tooltip');

    if (tooltip) {
      tooltip.remove();
    }
  }
}
