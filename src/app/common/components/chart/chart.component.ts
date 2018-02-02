import { Component, Input, OnInit } from '@angular/core';
import { ChartService } from '../../chart.service';
import { HandleSubscription } from '../../handle-subscription';

import * as moment from 'moment';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent extends HandleSubscription implements OnInit {
  @Input() barWidth: number;

  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        barRoundness: 50,
        barThickness: 5,
        maxBarThickness: 5,
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

  barChartLabels = [];

  barChartType = 'bar';

  barChartData: any[] = [
    {
      data: []
    }
  ];

  lineChartColors: any[] = [
    { // grey
      backgroundColor: '#55a8fd',
      pointBackgroundColor: 'blue',
      pointBorderColor: 'red',
      pointHoverBackgroundColor: 'gray',
      pointHoverBorderColor: 'yellow'
    }
  ];

  constructor(
    private chartService: ChartService,
  ) {
    super(null);
  }

  ngOnInit() {
    this.getChartData('month');
  }

  getChartData(span) {
    console.log('sa')
    this.barChartData[0].data = []

    const monthlyChartDataSubscription = this.chartService.getChartData(span)
      .subscribe((data) => {
        this.barChartData[0].data = data.values;
        const formattedLabels = data.labels.map((item) => {
          switch (span) {
            case 'day':
              return moment(item).format('HH:mm');
            case 'week':
              return moment(item).format('HH:mm');
            case 'month':
              return moment(item).format('D');
          }
        });
        this.barChartLabels = formattedLabels;
      });

    this.subscriptions.push(monthlyChartDataSubscription);
  }

  test() {
    console.log('test');
  }

  // events
  chartClicked(e: any): void {
    console.log(e);
  }

  chartHovered(e: any): void {
    console.log(e);
  }

}
