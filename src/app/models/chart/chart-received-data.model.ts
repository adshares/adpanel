export interface ChartReceivedData {
  values: number[];
  timestamps: string[];
  difference?: number;
  differenceInPercentage?: number;
  total?: number;
}
