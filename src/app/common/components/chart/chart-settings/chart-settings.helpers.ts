import * as moment from 'moment'
import {
  DAY_AND_MONTH_FORMAT,
  DAY_AND_TIME_FORMAT,
  MONTH_AND_YEAR_FORMAT,
  TIME_FORMAT,
  WEEK_AND_MONTH_FORMAT,
  YEAR_FORMAT,
} from 'common/utilities/consts'
import { currencySymbolByCode, formatMoney } from 'common/utilities/helpers'
import { advChartSeriesEnum, pubChartSeriesEnum } from 'models/enum/chart.enum'
import { ChartComponent } from 'common/components/chart/chart.component'
import { environment } from 'environments/environment'

function getFormatByDaysSpan (daysSpan: number): string {
  if (daysSpan === 0) {
    return TIME_FORMAT
  } else if (daysSpan <= 2) {
    return DAY_AND_TIME_FORMAT
  } else if (daysSpan <= 31) {
    return DAY_AND_MONTH_FORMAT
  } else if (daysSpan <= 182) {
    return WEEK_AND_MONTH_FORMAT
  } else if (daysSpan <= 730) {
    return MONTH_AND_YEAR_FORMAT
  } else {
    return YEAR_FORMAT
  }
}

export const mapDatesToChartLabels = (dates: string[]): string[] => {
  const values = dates.map(item => moment(item))
  const daysSpan = values[values.length - 1].diff(values[0], 'days')
  const format = getFormatByDaysSpan(daysSpan)
  return values.map(value => value.format(format))
}

export const adjustTooltipValueFormat = (value: string): string => {
  const type = ChartComponent.seriesType

  switch (type) {
    case advChartSeriesEnum.sum:
    case advChartSeriesEnum.sumPayment:
    case advChartSeriesEnum.cpc:
    case advChartSeriesEnum.cpm:
    case pubChartSeriesEnum.sum:
    case pubChartSeriesEnum.sumHour:
    case pubChartSeriesEnum.rpm:
      const val = parseInt(value)
      return `${type}: ${val > 0 ? formatMoney(val, 2) : 0} ${environment.currencyCode}`
    default:
      return `${type}: ${value}`
  }
}

export const adjustYAxesTics = (value) => {
  const type = ChartComponent.seriesType

  switch (type) {
    case advChartSeriesEnum.sum:
    case advChartSeriesEnum.sumPayment:
    case advChartSeriesEnum.cpc:
    case advChartSeriesEnum.cpm:
    case pubChartSeriesEnum.sum:
    case pubChartSeriesEnum.sumHour:
    case pubChartSeriesEnum.rpm:
      const val = parseInt(value)
      return `${currencySymbolByCode(environment.currencyCode)}${val > 0 ? formatMoney(val, 2) : 0}`
    default:
      return `${value}`
  }
}
