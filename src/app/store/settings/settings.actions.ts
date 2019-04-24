import { Action } from '@ngrx/store';
import {
  BillingHistory,
  NotificationItem,
} from 'models/settings.model';
import { User } from "models/user.model";

export const LOAD_NOTIFICATIONS_SETTINGS = 'Notifications Settings loaded';
export const LOAD_NOTIFICATIONS_SETTINGS_SUCCESS = 'Notifications Settings loaded success';

export const UPDATE_NOTIFICATIONS_SETTINGS = 'Updated push notification settings';
export const GET_CURRENT_BALANCE = 'Get current balance';
export const GET_CURRENT_BALANCE_SUCCESS = 'Get current balance success';
export const GET_CURRENT_BALANCE_FAILURE = 'Get current balance failure';

export const CANCEL_AWAITING_TRANSACTION = 'Cancel awaiting transaction';
export const CANCEL_AWAITING_TRANSACTION_SUCCESS = 'Cancel awaiting transaction success';
export const CANCEL_AWAITING_TRANSACTION_FAILURE = 'Cancel awaiting transaction failure';

export const GET_BILLING_HISTORY = 'Get billing history';
export const GET_BILLING_HISTORY_SUCCESS = 'Get billing history success';
export const GET_BILLING_HISTORY_FAILURE = 'Get billing history failure';

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

  constructor(public payload: User) {
  }
}

export class GetCurrentBalanceFailure implements Action {
  readonly type: string = GET_CURRENT_BALANCE_FAILURE;

  constructor(public payload: any) {
  }
}

export class CancelAwaitingTransaction implements Action {
  readonly type: string = CANCEL_AWAITING_TRANSACTION;

  constructor(public payload: number) {
  }
}

export class CancelAwaitingTransactionSuccess implements Action {
  readonly type: string = CANCEL_AWAITING_TRANSACTION_SUCCESS;

  constructor(public payload?: number) {
  }
}

export class CancelAwaitingTransactionFailure implements Action {
  readonly type: string = CANCEL_AWAITING_TRANSACTION_FAILURE;

  constructor(public payload: string) {
  }
}

export class GetBillingHistory implements Action {
  readonly type: string = GET_BILLING_HISTORY;

  constructor(public payload?: {limit?: number, offset?: number}) {
  }
}

export class GetBillingHistorySuccess implements Action {
  readonly type: string = GET_BILLING_HISTORY_SUCCESS;

  constructor(public payload: BillingHistory) {
  }
}

export class GetBillingHistoryFailure implements Action {
  readonly type: string = GET_BILLING_HISTORY_FAILURE;

  constructor(public payload: string) {
  }
}


export type actions = LoadNotificationsSettings
  | UpdateNotificationSettings
  | GetCurrentBalance
  | GetCurrentBalanceSuccess
  | GetCurrentBalanceFailure
  | CancelAwaitingTransaction
  | CancelAwaitingTransactionSuccess
  | CancelAwaitingTransactionFailure
  | GetBillingHistory
  | GetBillingHistorySuccess
  | GetBillingHistoryFailure;
