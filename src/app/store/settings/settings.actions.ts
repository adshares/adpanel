import {Action} from '@ngrx/store';

import {NotificationItem} from 'models/settings.model';

export const LOAD_NOTIFICATIONS_SETTINGS = 'Notifications Settings loaded';
export const LOAD_NOTIFICATIONS_SETTINGS_SUCCESS = 'Notifications Settings loaded success';

export const UPDATE_NOTIFICATIONS_SETTINGS = 'Updated push notification settings';
export const GET_CURRENT_BALANCE = 'Get current balance';
export const GET_CURRENT_BALANCE_SUCCESS = 'Get current balance success';
export const GET_CURRENT_BALANCE_FAILURE = 'Get current balance failure';

export class LoadNotificationsSettings implements Action {
  readonly type: string = LOAD_NOTIFICATIONS_SETTINGS;

  constructor(public payload: any) {
  }
}

export class LoadNotificationsSettingsSuccess implements Action {
  readonly type: string = LOAD_NOTIFICATIONS_SETTINGS_SUCCESS;

  constructor(public payload: any) {
  }
}

export class UpdateNotificationSettings implements Action {
  readonly type: string = UPDATE_NOTIFICATIONS_SETTINGS;

  constructor(public payload: NotificationItem[]) {
  }
}

export class GetCurrentBalance implements Action {
  readonly type: string = GET_CURRENT_BALANCE;

  constructor(public payload?: any) {
  }
}

export class GetCurrentBalanceSuccess implements Action {
  readonly type: string = GET_CURRENT_BALANCE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class GetCurrentBalanceFailure implements Action {
  readonly type: string = GET_CURRENT_BALANCE_FAILURE;

  constructor(public payload: any) {
  }
}

export type actions = LoadNotificationsSettings
  | UpdateNotificationSettings
  | GetCurrentBalance
  | GetCurrentBalanceFailure
  | GetCurrentBalanceSuccess;
