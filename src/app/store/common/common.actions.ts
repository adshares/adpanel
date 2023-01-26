import { Action } from '@ngrx/store';
import { ChartFilterSettings } from 'models/chart/chart-filter-settings.model';
import { reportType } from 'models/enum/user.enum';
import { Info, Placeholders } from 'models/info.model';

export const LOAD_INFO = 'Info loading';
export const LOAD_INFO_SUCCESS = 'Info loading success';

export const LOAD_PLACEHOLDERS_SUCCESS = 'Load placeholders success';

export const SET_ACTIVE_USER_TYPE = 'Active User Type set';
export const SET_CHART_FILTER_SETTINGS = 'Chart filter settings set';

export const SHOW_SUCCESS_SNACKBAR = 'Show success snackbar';
export const SHOW_DIALOG_ON_ERROR = 'Show dialog on error';

export const REQUEST_REPORT = 'Request report';
export const REQUEST_REPORT_SUCCESS = 'Request report success';

export class LoadInfo implements Action {
  readonly type: string = LOAD_INFO;

  constructor(public payload?: any) {}
}

export class LoadInfoSuccess implements Action {
  readonly type: string = LOAD_INFO_SUCCESS;

  constructor(public payload: Info) {}
}

export class LoadPlaceholdersSuccess implements Action {
  readonly type: string = LOAD_PLACEHOLDERS_SUCCESS;

  constructor(public payload: Placeholders) {}
}

export class ShowDialogOnError implements Action {
  readonly type = SHOW_DIALOG_ON_ERROR;

  constructor(public payload: string) {}
}

export class SetActiveUserType implements Action {
  readonly type = SET_ACTIVE_USER_TYPE;

  constructor(public payload: number) {}
}

export class SetChartFilterSettings implements Action {
  readonly type = SET_CHART_FILTER_SETTINGS;

  constructor(public payload: ChartFilterSettings) {}
}

export class ShowSuccessSnackbar implements Action {
  readonly type = SHOW_SUCCESS_SNACKBAR;

  constructor(public payload: string) {}
}

export class RequestReport implements Action {
  readonly type: string = REQUEST_REPORT;

  constructor(
    public payload: {
      type: reportType;
      dateStart: string;
      dateEnd: string;
      id?: number;
    }
  ) {}
}

export class RequestReportSuccess implements Action {
  readonly type: string = REQUEST_REPORT_SUCCESS;

  constructor(public payload?: any) {}
}

export type actions =
  | LoadInfo
  | LoadInfoSuccess
  | LoadPlaceholdersSuccess
  | SetActiveUserType
  | SetChartFilterSettings
  | ShowSuccessSnackbar
  | RequestReport
  | RequestReportSuccess;
