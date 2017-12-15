import { Action } from '@ngrx/store';

export const LOAD_BILLING_HISTORY = 'Billing History loaded';
export const LOAD_BILLING_HISTORY_SUCCESS = 'Billing History loaded success';

export const LOAD_NOTIFICATIONS_SETTINGS = 'Notifications Settings loaded';
export const LOAD_NOTIFICATIONS_SETTINGS_SUCCESS = 'Notifications Settings loaded success';

export class LoadBillingHistory implements Action {
  readonly type: string = LOAD_BILLING_HISTORY;
  constructor(public payload: any) { }
}

export class LoadBillingHistorySuccess implements Action {
  readonly type: string = LOAD_BILLING_HISTORY_SUCCESS;
  constructor(public payload: any) { }
}

export class LoadNotificationsSettings implements Action {
  readonly type: string = LOAD_NOTIFICATIONS_SETTINGS;
  constructor(public payload: any) { }
}

export class LoadNotificationsSettingsSuccess implements Action {
  readonly type: string = LOAD_NOTIFICATIONS_SETTINGS_SUCCESS;
  constructor(public payload: any) { }
}

export type actions = LoadBillingHistory | LoadNotificationsSettings;
