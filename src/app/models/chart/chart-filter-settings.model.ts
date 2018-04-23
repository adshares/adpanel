export interface ChartFilterSettings {
  currentTo: string;
  currentFrom: string;
  currentFrequency: string;
  currentAssetId: number;
  currentSeries?: string;
}

export interface TimespanFilter {
  from: string;
  to: string;
}

export interface FilterPreset {
  daysBack: number;
  title: string;
}
