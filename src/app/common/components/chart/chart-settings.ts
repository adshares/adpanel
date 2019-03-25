import {ChartOptions} from 'models/chart/chart-options.model';
import {ChartColors} from 'models/chart/chart-colors.model';
import {ChartJsComputedData, TooltipItem} from 'models/chart/chart-other.model';
import * as moment from 'moment';

const adjustLabelFormat = (value, index, values) => {
  const daysSpan = moment(values[values.length - 1]).diff(moment(values[0]), 'days');
  if (daysSpan === 0) {
    return moment(value).format('LT');
  } else if (daysSpan <= 2) {
    return moment(value).format('ddd LT');
  } else if (daysSpan <= 31) {
    return moment(value).format('D MMM');
  } else if (daysSpan <= 182) {
    return moment(value).format('W [week,] MMM YYYY');
  } else if (daysSpan <= 730) {
    return moment(value).format('MMM YYYY');
  } else {
    return moment(value).format('YYYY');
  }
};

const chartOptions: ChartOptions = {
  scaleShowVerticalLines: false,
  responsive: true,
  maintainAspectRatio: false,
  tooltips: {
    mode: 'index',
    intersect: false,
    enabled: false,
    callbacks: {
      title: (tooltipItems: TooltipItem[], data: ChartJsComputedData) => {
        const value = adjustLabelFormat(data.labels[tooltipItems[0].index], tooltipItems[0].index, data.labels);
        return value;
      },
      label: (tooltipItem: TooltipItem, data: ChartJsComputedData) => {
        let label = data.datasets[0].currentSeries || '';

        if (label) {
          label += ': ';
        }
        label += Math.round(tooltipItem.yLabel * 100) / 100;
        return label;
      }
    },

    custom: function (tooltipModel) {
      const getBody = (bodyItem) => {
        return bodyItem.lines;
      };

      // Tooltip Element
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
        const bodyLines = tooltipModel.body.map(getBody);

        let innerHtml = '<thead>';

        titleLines.forEach((title) => {
          innerHtml += '<tr><th class="chartjs-tooltip__title">' + title + '</th></tr>';
        });
        innerHtml += '</thead><tbody>';

        bodyLines.forEach((body, i) => {
          const span = '<span></span>';
          innerHtml += '<tr><td>' + span + body + '</td></tr>';
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
    }
  },
  hover: {
    mode: 'index',
    intersect: false
  },
  scales: {
    xAxes: [{
      barPercentage: 0.2,
      gridLines: {
        borderDash: [8, 4],
        color: '#eff2f4'
      },
      ticks: {
        autoSkip: false,
        maxRotation: 70,
        fontColor: '#9c9c9c',
        fontSize: 15,
        beginAtZero: true,
        callback: (value, index, values) => adjustLabelFormat(value, index, values),
      }
    }],
    yAxes: [{
      gridLines: {
        color: '#eff2f4',
        zeroLineColor: '#eff2f4'
      },
      ticks: {
        maxTicksLimit: 3,
        fontColor: '#9c9c9c',
        fontSize: 16,
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

export {chartOptions, chartColors};
