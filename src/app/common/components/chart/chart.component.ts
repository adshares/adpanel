import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

import { chartColors, chartOptions } from './chart-settings';
import { AppState } from 'models/app-state.model';
import { HandleSubscription } from 'common/handle-subscription';
import { ChartFilterSettings } from 'models/chart/chart-filter-settings.model';
import { ChartLabels } from 'models/chart/chart-labels.model';
import { ChartData } from 'models/chart/chart-data.model';
import { ChartColors } from 'models/chart/chart-colors.model';
import { ChartOptions } from 'models/chart/chart-options.model';
import * as commonActions from 'store/common/common.actions';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent extends HandleSubscription implements OnInit {
  @Input() chartSpan: string;
  @Input() seriesType?: string;
  @Input() barChartData: ChartData[][] | ChartData[];
  @Input() barChartLabels: ChartLabels[];
  @Output() update: EventEmitter<ChartFilterSettings> = new EventEmitter();

  currentChartFilterSettings: ChartFilterSettings;
  barChartOptions: ChartOptions = chartOptions;
  barChartColors: ChartColors[] = chartColors;

  constructor(private store: Store<AppState>) {
    super();
  }

  ngOnInit() {
    const chartFilterSubscription = this.store.select('state', 'common', 'chartFilterSettings')
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.currentChartFilterSettings = chartFilterSettings;
      });

    this.subscriptions.push(chartFilterSubscription);

  }

  updateChartData(timespan) {
    const from = this.currentChartFilterSettings.currentFrom = moment(timespan.from).format();
    const to = this.currentChartFilterSettings.currentTo = moment(timespan.to).format();
    const daysSpan = moment(to).diff(moment(from), 'days');

    if (daysSpan <= 1) {
      this.currentChartFilterSettings.currentFrequency = 'hours';
    } else if (daysSpan <= 7) {
      this.currentChartFilterSettings.currentFrequency = 'quarters';
    } else if (daysSpan <= 31) {
      this.currentChartFilterSettings.currentFrequency = 'days';
    } else {
      this.currentChartFilterSettings.currentFrequency = 'lastThirty';
    }

    this.store.dispatch(new commonActions.SetChartFilterSettings(this.currentChartFilterSettings));
    this.update.emit(this.currentChartFilterSettings);
  }

  updateChartDataSeries(series) {
    this.currentChartFilterSettings.currentSeries = series;
    this.store.dispatch(new commonActions.SetChartFilterSettings(this.currentChartFilterSettings));
    this.update.emit(this.currentChartFilterSettings);
  }

  updateChartDataAssetId(assetId) {
    this.currentChartFilterSettings.currentAssetId = assetId;
    this.store.dispatch(new commonActions.SetChartFilterSettings(this.currentChartFilterSettings));
    this.update.emit(this.currentChartFilterSettings);
  }
}
