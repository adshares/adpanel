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
  @Input() chartSpan: string;
  @Input() statType?: string;

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
    { // grey
      backgroundColor: '#55a8fd',
      borderColor: '#55a8fd',
      pointBackgroundColor: '#4ba3fd',
      pointBorderColor: '#55a8fd',
      pointHoverBackgroundColor: '#4ba3fd',
      pointHoverBorderColor: '#55a8fd'
    }
  ];

  barChartLabels = [];
  barChartType = 'bar';
  barChartData: any[] = [{data: []}];
  barChartValue: 20;
  barChartDifference: number;
  barChartDifferenceInPercentage: number;

  constructor(
    private chartService: ChartService,
  ) {
    super(null);
  }

  ngOnInit() {
    this.getChartData(this.chartSpan, this.statType);
  }

  getChartData(span = 'month', statType = '') {
    const monthlyChartDataSubscription = this.chartService.getChartData(span, statType)
      .subscribe((data) => {
      console.log(data);
        this.barChartData[0].data = data.values;
        const formattedLabels = data.timestamps.map((item) => {
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
        this.barChartValue = data.total;
        this.barChartDifference = data.difference;
        this.barChartDifferenceInPercentage = data.differenceInPercentage;
      });

    this.subscriptions.push(monthlyChartDataSubscription);
  }

  // events
  chartClicked(e: any): void {
    console.log(e);
  }

  chartHovered(e: any): void {
    console.log(e);
  }

}
