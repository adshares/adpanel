import {Component, EventEmitter, Input, Output} from '@angular/core';

import { ChartFilterSettings } from '../../../models/chart/chart-filter-settings.model';
import { chartFilterSettingsInitialState } from '../../../models/initial-state/chart-filter-settings';
import { ChartLabels } from '../../../models/chart/chart-labels.model';
import { ChartData } from '../../../models/chart/chart-data.model';
import { ChartColors } from '../../../models/chart/chart-colors.model';
import { ChartOptions } from '../../../models/chart/chart-options.model';
import { chartColors, chartOptions } from '../../../../app-settings/app-settings';

import { cloneDeep } from '../../utilities/helpers';
import * as moment from 'moment';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent {
  @Input() chartSpan: string;
  @Input() seriesType?: string;
  @Input() barChartData: ChartData[][] | ChartData[];
  @Input() barChartLabels: ChartLabels[];
  @Output() update: EventEmitter<any> = new EventEmitter();

  currentChartFilterSettings: ChartFilterSettings = cloneDeep(chartFilterSettingsInitialState);
  barChartOptions: ChartOptions = chartOptions;
  barChartColors: ChartColors[] = chartColors;

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
