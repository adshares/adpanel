export interface ChartJsComputedData {
  labels: string[];
  datasets: object;
}

export interface TooltipItem {
  datasetIndex: number;
  index: number;
  x: number;
  xLabel: string;
  y: number;
  yLabel: number;
}
