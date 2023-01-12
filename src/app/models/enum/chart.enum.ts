export enum pubChartSeriesEnum {
  view = 'Views',
  click = 'Clicks',
  ctr = 'Click-through Rate',
  rpm = 'AVG Revenue / Mile',
  sum = 'Revenue (Accrual)',
  sumHour = 'Revenue (Cash)',
  viewUnique = 'Unique Views',
  viewInvalidRate = 'Invalid Views Rate',
  clickInvalidRate = 'Invalid Clicks Rate',
}

export enum advChartSeriesEnum {
  view = 'Views',
  click = 'Clicks',
  cpc = 'AVG Cost / Click',
  ctr = 'Click-through Rate',
  cpm = 'AVG Cost / Mile',
  sum = 'Cost (Accrual)',
  sumPayment = 'Cost (Cash)',
  viewUnique = 'Unique Views',
  viewInvalidRate = 'Invalid Views Rate',
  clickInvalidRate = 'Invalid Clicks Rate',
}

export enum filterPresetsEnum {
  'Today' = 0,
  'Last 7 days' = 6,
  'Last 30 days' = 30,
}
