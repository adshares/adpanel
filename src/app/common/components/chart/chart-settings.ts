import { ChartOptions } from '../../../models/chart/chart-options.model';
import { ChartColors } from '../../../models/chart/chart-colors.model';

const chartOptions: ChartOptions = {
  scaleShowVerticalLines: false,
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    xAxes: [{
      barPercentage: 0.2,
      gridLines: {
        borderDash: [8, 4],
        color: '#eff2f4'
      },
      ticks: {
        autoSkip: true,
        fontColor: '#aebac7',
        fontSize: 14,
        beginAtZero: true
      }
    }],
    yAxes: [{
      gridLines: {
        color: '#eff2f4',
        zeroLineColor: '#eff2f4'
      },
      ticks: {
        maxTicksLimit: 3,
        fontColor: '#aebac7',
        fontSize: 14,
        beginAtZero: true,
        padding: 10
      }
    }]
  }
};

const chartColors: ChartColors[] = [
  {
    backgroundColor: '#55a8fd',
    borderColor: '#55a8fd',
    pointBackgroundColor: '#4ba3fd',
    pointBorderColor: '#55a8fd',
    pointHoverBackgroundColor: '#4ba3fd',
    pointHoverBorderColor: '#55a8fd'
  }
];

export { chartOptions, chartColors };
