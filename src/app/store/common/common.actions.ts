import { Action } from '@ngrx/store';
import { ChartFilterSettings } from 'models/chart/chart-filter-settings.model';
import { Notification } from 'models/notification.model';
import { reportType } from 'models/enum/user.enum';

export const SET_ACTIVE_USER_TYPE = 'Active User Type set';
export const SET_CHART_FILTER_SETTINGS = 'Chart filter settings set';
export const SET_ADSHARES_ADDRESS = 'Adshares Address set';
export const SHOW_SUCCESS_SNACKBAR = 'Show success snackbar';

export const LOAD_NOTIFICATIONS = 'Notifications loaded';
export const LOAD_NOTIFICATIONS_SUCCESS = 'Notifications loaded success';
export const UPDATE_NOTIFICATIONS = 'Notifications updated';

export const SHOW_DIALOG_ON_ERROR = 'Show dialog on error';

export const REQUEST_REPORT = 'Request report';
export const REQUEST_REPORT_SUCCESS = 'Request report success';
export const REQUEST_REPORT_FAILURE = 'Request report failure';

export class ShowDialogOnError implements Action {
  readonly type = SHOW_DIALOG_ON_ERROR;

  constructor(public payload: string) {
  }
}

export class SetActiveUserType implements Action {
  readonly type = SET_ACTIVE_USER_TYPE;

  constructor(public payload: number) {
  }
}

export class SetChartFilterSettings implements Action {
  readonly type = SET_CHART_FILTER_SETTINGS;

  constructor(public payload: ChartFilterSettings) {
  }
}

export class SetAdsharesAddress implements Action {
  readonly type = SET_ADSHARES_ADDRESS;

  constructor(public payload: string) {
  }
}

export class LoadNotifications implements Action {
  readonly type = LOAD_NOTIFICATIONS;

  constructor(public payload: any) {
  }
}

export class LoadNotificationsSuccess implements Action {
  readonly type = LOAD_NOTIFICATIONS_SUCCESS;

  constructor(public payload: Notification[]) {
  }
}

export class UpdateNotifications implements Action {
  readonly type = UPDATE_NOTIFICATIONS;

  constructor(public payload: any) {
  }
}

export class ShowSuccessSnackbar implements Action {
  readonly type = SHOW_SUCCESS_SNACKBAR;

  constructor(public payload: string) {
  }
}

export class RequestReport implements Action {
  readonly type: string = REQUEST_REPORT;

  constructor(public payload: { type: reportType, dateStart: string, dateEnd: string, id?: number }) {
  }
}

export class RequestReportSuccess implements Action {
  readonly type: string = REQUEST_REPORT_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class RequestReportFailure implements Action {
  readonly type: string = REQUEST_REPORT_FAILURE;

  constructor(public payload?: any) {
  }
}

export type actions =
  | SetActiveUserType
  | SetChartFilterSettings
  | SetAdsharesAddress
  | LoadNotifications
  | LoadNotificationsSuccess
  | UpdateNotifications
  | ShowSuccessSnackbar
  | RequestReport
  | RequestReportSuccess
  | RequestReportFailure ;
