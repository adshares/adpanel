import * as moment from 'moment';
import { ChartFilterSettings } from '../chart-filter-settings.model';

export const chartFilterSettingsInitialState: ChartFilterSettings = {
  currentTo: moment().format(),
  currentFrom: moment().subtract(30, 'days').format(),
  currentFrequency: '1D',
  currentAssetId: 1,
  currentSeries: 'series'
};
