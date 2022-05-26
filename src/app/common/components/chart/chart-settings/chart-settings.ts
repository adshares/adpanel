import { Color } from 'ng2-charts/lib/color';
import { ChartData, ChartOptions, ChartTooltipItem } from 'chart.js';
import {
  adjustLabelFormat,
  adjustTooltipValueFormat,
  adjustYAxesTics
} from "common/components/chart/chart-settings/chart-settings.helpers";


const chartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  tooltips: {
    enabled: false,
    custom: function (tooltipModel) {
      let tooltipEl = document.getElementById('chartjs-tooltip');

      // Create element on first render
      if (!tooltipEl) {
        tooltipEl = document.createElement('div');

        Object.assign(tooltipEl, {
          id: 'chartjs-tooltip',
          innerHTML: '<table></table>'
        });

        document.body.appendChild(tooltipEl);
      }

      // Hide if no tooltip
      if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = '0';
        return;
      }

      // Set Text
      if (tooltipModel.body) {
        const titleLines = tooltipModel.title || [];
        const bodyLines = tooltipModel.body.map(bodyItem => bodyItem.lines);

        let innerHtml = '<thead>';
        titleLines.forEach((title) => {
          innerHtml += '<tr><th class="chartjs-tooltip__title">' + title + '</th></tr>';
        });
        innerHtml += '</thead><tbody>';

        bodyLines.forEach(bodyLine => {
          const value = bodyLine[0].split(': ')[1];
          innerHtml += '<tr><td><span>' + adjustTooltipValueFormat(value) + '</span></td></tr>';
        });
        innerHtml += '</tbody>';
        const tableRoot = tooltipEl.querySelector('table');
        tableRoot.innerHTML = innerHtml;
      }

      // `this` will be the overall tooltip
      const position = this._chart.canvas.getBoundingClientRect();

      // Display, position, and set styles for font

      Object.assign(tooltipEl.style, {
        opacity: '1',
        position: 'absolute',
        left: position.left + 15 + tooltipModel.caretX + 'px',
        top: position.top + window.pageYOffset + tooltipModel.caretY + 'px',
        textAlign: 'left',
        fontFamily: 'Lato-Regular',
        fontSize: 14 + 'px',
        color: '#FFFFFF',
        padding: '7px 10px',
        borderRadius: '2px',
        boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.15)',
        transition: 'opacity 0.3s ease'
      });
    },
    mode: 'index',
    intersect: false,
    callbacks: {
      title: (tooltipItems: ChartTooltipItem[], data: ChartData) => {
        return adjustLabelFormat(data.labels[tooltipItems[0].index], data.labels);
      },
      label: (tooltipItem: ChartTooltipItem, data: ChartData) => {
        let label = data.datasets[0].label || '';

        if (label) {
          label += ': ';
        }
        label += Math.round(Number(tooltipItem.yLabel) * 100) / 100;
        return label;
      }
    },
  },
  hover: {
    mode: 'index',
    intersect: false
  },
  scales: {
    xAxes: [{
      gridLines: {
        borderDash: [8, 4],
        color: '#eff2f4',
        display : false,
      },
      ticks: {
        autoSkip: false,
        beginAtZero: true,
        callback: (value, index, data) => adjustLabelFormat(value, data),
        maxRotation: 70,
        fontColor: '#9c9c9c',
        fontSize: 15,
      }
    }],
    yAxes: [{
      gridLines: {
        color: '#eff2f4',
        zeroLineColor: '#eff2f4',
      },
      ticks: {
        beginAtZero: true,
        callback: (value, _index, _values) => adjustYAxesTics(value),
        fontColor: '#9c9c9c',
        fontSize: 16,
        maxTicksLimit: 3,
        padding: 10,
      }
    }]
  }
};

const chartColors: Color[] = [
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
