import { Action } from '@ngrx/store';

import { NotificationItem } from 'models/settings.model';

export const LOAD_BILLING_HISTORY = 'Billing History loaded';
export const LOAD_BILLING_HISTORY_SUCCESS = 'Billing History loaded success';

export const LOAD_NOTIFICATIONS_SETTINGS = 'Notifications Settings loaded';
export const LOAD_NOTIFICATIONS_SETTINGS_SUCCESS = 'Notifications Settings loaded success';

export const UPDATE_NOTIFICATIONS_SETTINGS = 'Updated push-notification settings';

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

export class UpdateNotificationSettings implements Action {
  readonly type: string = UPDATE_NOTIFICATIONS_SETTINGS;
  constructor(public payload: NotificationItem[]) { }
}

export type actions = LoadBillingHistory | LoadNotificationsSettings | UpdateNotificationSettings;
