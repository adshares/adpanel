import { Action } from '@ngrx/store';
import { ChartFilterSettings } from 'models/chart/chart-filter-settings.model';
import { Notifications } from 'models/notifications-model';

export const SET_ACTIVE_USER_TYPE = 'Active User Type set';
export const SET_CHART_FILTER_SETTINGS = 'Chart filter settings set';
export const SET_ADSHARES_ADDRESS = 'Adshares Address set';
export const LOAD_NOTIFICATIONS = 'Notifications loaded';

export class SetActiveUserType implements Action {
  readonly type = SET_ACTIVE_USER_TYPE;
  constructor(public payload: number) { }
}

export class SetChartFilterSettings implements Action {
  readonly type = SET_CHART_FILTER_SETTINGS;
  constructor(public payload: ChartFilterSettings) { }
}

export class SetAdsharesAddress implements Action {
  readonly type = SET_ADSHARES_ADDRESS;
  constructor(public payload: string) { }
}

export class LoadNotifications implements Action {
  readonly type = LOAD_NOTIFICATIONS;
  constructor(public payload: Notifications) { }
}


export type actions =
  SetActiveUserType |
  SetChartFilterSettings |
  SetAdsharesAddress |
  LoadNotifications;
