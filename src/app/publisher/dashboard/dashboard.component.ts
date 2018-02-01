import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
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

  // events
  chartClicked(e: any): void {
    console.log(e);
  }

  chartHovered(e: any): void {
    console.log(e);
  }
  randomize(): void {
    // Only Change 3 values
    const data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    const clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
  }
}
