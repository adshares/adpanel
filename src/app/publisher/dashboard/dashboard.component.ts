import { Component, OnInit } from '@angular/core';
import { ChartService } from '../../common/chart.service';

import * as moment from 'moment'
import {HandleSubscription} from "../../common/handle-subscription";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends HandleSubscription implements OnInit {
  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      xAxes: [{
        barRoundness: 50,
        barThickness: 6,
        maxBarThickness: 6,
        gridLines: {
          borderDash: [8, 4],
          color: '#eff2f4'
        },
        ticks: {
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
          fontColor: '#aebac7',
          fontSize: 14,
          beginAtZero: true
        }
      }]
    }
  };

  barChartLabels = [
    '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2006',
    '2007', '2008', '2009', '2010', '2011', '2006', '2007', '2008',
    '2009', '2010', '2011', '2006', '2007', '2008', '2009', '2010',
    '2011'
  ];

  barChartType = 'bar';

  barChartData: any[] = [
    {
      data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 65, 59, 80, 81, 56, 55, 65, 59, 80, 81, 56, 55],
      label: 'Series A',
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
    const monthlyChartDataSubscription = this.chartService.getChartData(span)
      .subscribe((data) => {
        this.barChartData[0].data = data.values;
        const formattedLabels = data.labels.map((item) => {
          return moment(item).format('D');
        });
        this.barChartLabels = formattedLabels;
      });
    this.subscriptions.push(monthlyChartDataSubscription);
  }
  //
  // getWeeklyChartData() {
  //   const weeklyChartDataSubscription = this.chartService.getWeeklyChartData()
  //     .subscribe((data) => {
  //       this.barChartData[0].data = data.values;
  //       const formattedLabels = data.labels.map((item) => {
  //         return moment(item).format('HH:mm');
  //       });
  //       this.barChartLabels = formattedLabels;
  //     });
  //   this.subscriptions.push(weeklyChartDataSubscription);
  // }
  //
  // getDailyChartData() {
  //   const dailyChartDataSubscription = this.chartService.getDailyChartData()
  //     .subscribe((data) => {
  //       this.barChartData[0].data = data.values;
  //       const formattedLabels = data.labels.map((item) => {
  //         return moment(item).format('HH:mm');
  //       });
  //       this.barChartLabels = formattedLabels;
  //     });
  //   this.subscriptions.push(dailyChartDataSubscription);
  // }

  // events
  chartClicked(e: any): void {
    console.log(e);
  }

  chartHovered(e: any): void {
    console.log(e);
  }

}
