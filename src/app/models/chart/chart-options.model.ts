export interface ChartOptions {
  scaleShowVerticalLines?: boolean;
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  tooltips?: object;
  hover?: object;
  scales?: {
    xAxes?: [{
      barPercentage?: number,
      gridLines?: {
        borderDash?: number[],
        color?: string
      },
      ticks?: {
        maxRotation: number,
        autoSkip?: boolean,
        fontColor?: string,
        fontSize?: number,
        beginAtZero?: boolean,
        callback?: any;
      }
    }],
    yAxes?: [{
      gridLines?: {
        color?: string,
        zeroLineColor?: string
      },
      ticks?: {
        maxTicksLimit?: number,
        fontColor?: string,
        fontSize?: number,
        beginAtZero?: boolean,
        padding?: number,
        callback?: any,
      }
    }]
  };
}

