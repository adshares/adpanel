import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import {
  chartColors,
  chartOptions
} from './chart-settings/chart-settings';
import { AppState } from 'models/app-state.model';
import { HandleSubscription } from 'common/handle-subscription';
import { ChartFilterSettings } from 'models/chart/chart-filter-settings.model';
import { Color } from 'ng2-charts/lib/color';
import { ChartDataSets, ChartOptions } from 'chart.js'
import * as commonActions from 'store/common/common.actions';
import { Label } from 'ng2-charts';
import { chartSeriesInitialState } from "models/initial-state/chart-filter-settings";
import { cloneDeep } from 'common/utilities/helpers'


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent extends HandleSubscription implements OnInit, OnDestroy, OnChanges {
  @Input() chartSpan: string;
  @Input() barChartData: ChartDataSets[];
  @Input() barChartLabels: Label[];
  @Output() update: EventEmitter<ChartFilterSettings> = new EventEmitter();

  currentChartFilterSettings: ChartFilterSettings;
  barChartOptions: ChartOptions = chartOptions;
  barChartColors: Color[] = chartColors;
  static seriesType;

  constructor(private store: Store<AppState>) {
    super();
  }

  ngOnInit(): void {
    const chartFilterSubscription = this.store.select('state', 'common', 'chartFilterSettings')
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.currentChartFilterSettings = cloneDeep(chartFilterSettings);
      });

    this.subscriptions.push(chartFilterSubscription);
  }

  ngOnChanges(): void {
    ChartComponent.seriesType = this.barChartData[0].label;
  }

  updateChartData(timespan) {
    const from = this.currentChartFilterSettings.currentFrom = moment(timespan.from).startOf('day').format();
    const to = this.currentChartFilterSettings.currentTo = moment(timespan.to).endOf('day').format();
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
      currentSeries: chartSeriesInitialState
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
