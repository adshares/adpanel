import { Action } from '@ngrx/store';
import { ChartFilterSettings } from 'models/chart/chart-filter-settings.model';

export const SET_ACTIVE_USER_TYPE = 'Active User Type set';
export const SET_CHART_FILTER_SETTINGS = 'Chart filter settings set';
export const SET_ADSHARES_ETH_ADDRESS = 'Adshares Ethereum Address set';

export class SetActiveUserType implements Action {
  readonly type = SET_ACTIVE_USER_TYPE;

  constructor(public payload: number) { }
}

export class SetChartFilterSettings implements Action {
  readonly type = SET_CHART_FILTER_SETTINGS;

  constructor(public payload: ChartFilterSettings) { }
}

export class SetAdsharesEthAddress implements Action {
  readonly type = SET_ADSHARES_ETH_ADDRESS;

  constructor(public payload: string) { }
}

export type actions =
  SetActiveUserType |
  SetChartFilterSettings |
  SetAdsharesEthAddress;
