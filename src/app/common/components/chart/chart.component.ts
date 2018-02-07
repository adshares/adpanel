import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent {
  @Input() chartSpan: string;
  @Input() seriesType?: string;
  @Input() barChartData: any;
  @Input() barChartLabels: any[];

  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        barPercentage: 0.3,
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
          color: '#eff2f4'
        },
        ticks: {
          maxTicksLimit: 3,
          fontColor: '#aebac7',
          fontSize: 14,
          beginAtZero: true
        }
      }]
    }
  };

  barChartColors: any[] = [
    {
      backgroundColor: '#55a8fd',
      borderColor: '#55a8fd',
      pointBackgroundColor: '#4ba3fd',
      pointBorderColor: '#55a8fd',
      pointHoverBackgroundColor: '#4ba3fd',
      pointHoverBorderColor: '#55a8fd'
    }
  ];

  barChartType = 'bar';
}
