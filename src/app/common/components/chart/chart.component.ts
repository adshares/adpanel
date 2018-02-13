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

//
//
// Chart.types.Bar.extend({
//   name: "BarAlt",
//   initialize: function (data) {
//     Chart.types.Bar.prototype.initialize.apply(this, arguments);
//
//     if (this.options.curvature !== undefined && this.options.curvature <= 1) {
//       var rectangleDraw = this.datasets[0].bars[0].draw;
//       var self = this;
//       var radius = this.datasets[0].bars[0].width * this.options.curvature * 0.5;
//
//       // override the rectangle draw with ours
//       this.datasets.forEach(function (dataset) {
//         dataset.bars.forEach(function (bar) {
//           bar.draw = function () {
//             // draw the original bar a little down (so that our curve brings it to its original position)
//             var y = bar.y;
//             // the min is required so animation does not start from below the axes
//             bar.y = Math.min(bar.y + radius, self.scale.endPoint - 1);
//             // adjust the bar radius depending on how much of a curve we can draw
//             var barRadius = (bar.y - y);
//             rectangleDraw.apply(bar, arguments);
//
//             // draw a rounded rectangle on top
//             Chart.helpers.drawRoundedRectangle(self.chart.ctx, bar.x - bar.width / 2, bar.y - barRadius + 1, bar.width, bar.height, barRadius);
//             ctx.fill();
//
//             // restore the y value
//             bar.y = y;
//           }
//         })
//       })
//     }
//   }
// });
//
//
// var lineChartData = {
//   labels: ["January", "February", "March", "April", "May", "June"],
//   datasets: [
//     {
//       fillColor: "#79D1CF",
//       strokeColor: "#79D1CF",
//       data: [60, 80, 81, 56, 55, 40]
//     },
//     {
//       fillColor: "#D1CF79",
//       strokeColor: "#D1CF79",
//       data: [34, 43, 43, 12, 65, 65]
//     }
//   ]
// };
//
// var ctx = document.getElementById("myChart").getContext("2d");
// var myLine = new Chart(ctx).BarAlt(lineChartData, {
//   // 0 (flat) to 1 (more curvy)
//   curvature: 1
// });
