import * as moment from "moment";
import {
  DAY_AND_MONTH_FORMAT,
  DAY_AND_TIME_FORMAT,
  MONTH_AND_YEAR_FORMAT,
  TIME_FORMAT,
  WEEK_AND_MONTH_FORMAT, YEAR_FORMAT
} from "common/utilities/consts";
import { enumToObject, formatMoney } from "common/utilities/helpers";
import { advChartSeriesEnum, pubChartSeriesEnum } from "models/enum/chart.enum";
import { ChartComponent } from "common/components/chart/chart.component";

export const adjustLabelFormat = (value, values) => {
  const daysSpan = moment(values[values.length - 1]).diff(moment(values[0]), 'days');
  if (daysSpan === 0) {
    return moment(value).format(TIME_FORMAT);
  } else if (daysSpan <= 2) {
    return moment(value).format(DAY_AND_TIME_FORMAT);
  } else if (daysSpan <= 31) {
    return moment(value).format(DAY_AND_MONTH_FORMAT);
  } else if (daysSpan <= 182) {
    return moment(value).format(WEEK_AND_MONTH_FORMAT);
  } else if (daysSpan <= 730) {
    return moment(value).format(MONTH_AND_YEAR_FORMAT);
  } else {
    return moment(value).format(YEAR_FORMAT);
  }
};

export const adjustTooltipValueFormat = (value: string): string => {
  const options = {
    ...enumToObject(pubChartSeriesEnum),
    ...enumToObject(advChartSeriesEnum)
  };
  const type = ChartComponent.seriesType;

  switch (type) {
    case  options.SUM:
    case  options.CPC:
    case  options.CPM:
    case  options.RPM:
    case  options.RPC:
      const val = parseInt(value);
      return `${type}: ${val > 0 ? formatMoney(val) : 0} ADS`;
    default:
      return `${type}: ${value}`;
  }
};

export const adjustYAxesTics = (value) => {
  const options = {
    ...enumToObject(pubChartSeriesEnum),
    ...enumToObject(advChartSeriesEnum)
  };

  switch (ChartComponent.seriesType) {
    case  options.SUM:
    case  options.CPC:
    case  options.CPM:
    case  options.RPM:
    case  options.RPC:
      const val = parseInt(value);
      return `${val > 0 ? formatMoney(val) : 0}`;
    default:
      return `${value}`;
  }
};
