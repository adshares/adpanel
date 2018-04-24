export interface ChartJsComputedData {
  labels: any;
  datasets: any;
}

export interface TooltipItem {
  datasetIndex: number;
  index: number;
  x: number;
  xLabel: string;
  y: number;
  yLabel: number;
}
