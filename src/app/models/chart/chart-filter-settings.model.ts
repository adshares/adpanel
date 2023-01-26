import { Moment } from 'moment';

export interface ChartFilterSettings {
  currentTo: string;
  currentFrom: string;
  currentFrequency: string;
  currentAssetId: number;
  currentSeries?: seriesType;
  type?: string;
}

export interface seriesType {
  label: string;
  value: string;
}

export interface TimespanFilter {
  from: string | Moment;
  to: string | Moment;
}

export interface FilterPreset {
  id: number;
  name: string;
}
