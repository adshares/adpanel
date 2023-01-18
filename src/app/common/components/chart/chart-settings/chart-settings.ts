import { ChartOptions } from 'chart.js';
import { ChartComponent } from 'common/components/chart/chart.component';
import { currencySymbolByCode, formatMoney, formatNumberWithComma } from 'common/utilities/helpers';
import { advChartSeriesEnum, pubChartSeriesEnum } from 'models/enum/chart.enum';

export const chartOptions = (currencyCode: string): ChartOptions<'bar'> => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
        enabled: false,
        callbacks: {
          label: context => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += Math.round(Number(context.dataset.data[context.dataIndex]) * 100) / 100;
            return label;
          },
        },
        external: function (context) {
          let tooltipEl = document.getElementById('chartjs-tooltip');

          // Create element on first render
          if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-tooltip';
            tooltipEl.innerHTML = '<table></table>';
            document.body.appendChild(tooltipEl);
          }

          // Hide if no tooltip
          const tooltipModel = context.tooltip;
          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = '0';
            return;
          }

          // Set Text
          if (tooltipModel.body) {
            const titleLines = tooltipModel.title || [];
            const bodyLines = tooltipModel.body.map(bodyItem => bodyItem.lines);

            let innerHtml = '<thead>';
            titleLines.forEach(title => {
              innerHtml += '<tr><th class="chartjs-tooltip__title">' + title + '</th></tr>';
            });
            innerHtml += '</thead><tbody>';

            bodyLines.forEach(bodyLine => {
              const value = bodyLine[0].split(': ')[1];
              innerHtml +=
                '<tr><td><span>' +
                formatNumberWithComma(adjustTooltipValueFormat(value, currencyCode)) +
                '</span></td></tr>';
            });
            innerHtml += '</tbody>';

            const tableRoot = tooltipEl.querySelector('table');
            tableRoot.innerHTML = innerHtml;
          }

          const position = context.chart.canvas.getBoundingClientRect();

          // Display, position, and set styles for font
          Object.assign(tooltipEl.style, {
            opacity: '1',
            position: 'absolute',
            left: position.left + 15 + tooltipModel.caretX + 'px',
            top: position.top + window.scrollY + tooltipModel.caretY + 'px',
            textAlign: 'left',
            fontFamily: 'Montserrat-Regular',
            fontSize: 14 + 'px',
            color: '#FFFFFF',
            padding: '7px 10px',
            borderRadius: '2px',
            boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.15)',
            transition: 'opacity 0.3s ease',
          });
        },
      },
    },
    hover: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: false,
          maxRotation: 70,
          color: '#9c9c9c',
          font: {
            size: 15,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: _context => '#eff2f4',
        },
        ticks: {
          callback: (value, _index, _values) => adjustYAxesTics(value, currencyCode),
          color: '#9c9c9c',
          font: {
            size: 16,
          },
          maxTicksLimit: 3,
          padding: 10,
        },
      },
    },
    datasets: {
      bar: {
        backgroundColor: '#96dfef',
        barPercentage: 0.2,
        borderColor: '#96dfef',
        hoverBackgroundColor: '#96dfef',
        hoverBorderColor: '#96dfef',
      },
    },
  };
};

const adjustTooltipValueFormat = (value: string, currencyCode: string): string => {
  const type = ChartComponent.seriesType;

  switch (type) {
    case advChartSeriesEnum.sum:
    case advChartSeriesEnum.sumPayment:
    case advChartSeriesEnum.cpc:
    case advChartSeriesEnum.cpm:
    case pubChartSeriesEnum.sum:
    case pubChartSeriesEnum.sumHour:
    case pubChartSeriesEnum.rpm:
      const val = parseInt(value);
      return `${type}: ${val > 0 ? formatMoney(val, 2) : 0} ${currencyCode}`;
    default:
      return `${type}: ${value}`;
  }
};

const adjustYAxesTics = (value, currencyCode: string) => {
  const type = ChartComponent.seriesType;

  switch (type) {
    case advChartSeriesEnum.sum:
    case advChartSeriesEnum.sumPayment:
    case advChartSeriesEnum.cpc:
    case advChartSeriesEnum.cpm:
    case pubChartSeriesEnum.sum:
    case pubChartSeriesEnum.sumHour:
    case pubChartSeriesEnum.rpm:
      const val = parseInt(value);
      return `${currencySymbolByCode(currencyCode)}${val > 0 ? formatMoney(val, 2) : 0}`;
    default:
      return `${value}`;
  }
};
