import {Moment} from "moment";

export interface ChartFilterSettings {
  currentTo: string;
  currentFrom: string;
  currentFrequency: string;
  currentAssetId: number;
  currentBannerId: number;
  currentSeries?: string;
  type?: string;
}

export interface TimespanFilter {
  from: string | Moment;
  to: string | Moment;
}

export interface FilterPreset {
  id: number;
  name: string;
}
