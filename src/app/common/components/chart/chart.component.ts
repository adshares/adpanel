import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../models/app-state.model';
import { HandleSubscription } from '../../handle-subscription';
import * as commonActions from '../../../store/common/common.actions';

import { ChartFilterSettings } from '../../../models/chart/chart-filter-settings.model';
import { ChartLabels } from '../../../models/chart/chart-labels.model';
import { ChartData } from '../../../models/chart/chart-data.model';
import { ChartColors } from '../../../models/chart/chart-colors.model';
import { ChartOptions } from '../../../models/chart/chart-options.model';
import { chartColors, chartOptions } from './chart-settings';

import * as moment from 'moment';

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
    super(null);
  }

  ngOnInit() {
    const chartDataSubscription = this.store.select('state', 'common', 'chartFilterSettings')
      .take(1)
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.currentChartFilterSettings = chartFilterSettings;
      });

    this.subscriptions.push(chartDataSubscription);

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

  // TODO ChartDataSeries and ID filtering
  // updateChartDataSeries(series) {
  //   this.currentSeries = series;
  //   this.barChartData[0].data = [];
  //   this.update.emit(this.currentFrom, this.currentTo, this.currentFrequency, this.currentAssetId, this.currentSeries);
  // }
  //
  // updateChartDataCampaign(assetId) {
  //   this.currentAssetId = assetId;
  //   this.barChartData[0].data = [];
  //   this.update.emit(this.currentFrom, this.currentTo, this.currentFrequency, this.currentAssetId, this.currentSeries);
  // }
}
