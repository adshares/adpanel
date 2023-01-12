import * as moment from 'moment';
import { ChartFilterSettings } from 'models/chart/chart-filter-settings.model';

export const chartSeriesInitialState = {
  label: 'View',
  value: 'view',
};

export const chartFilterSettingsInitialState: ChartFilterSettings = {
  currentTo: moment().format(),
  currentFrom: moment().subtract(30, 'days').format(),
  currentFrequency: 'day',
  currentAssetId: 0,
  currentSeries: chartSeriesInitialState,
};
