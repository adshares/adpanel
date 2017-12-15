import { Action } from '@ngrx/store';

export const LOAD_BILLING_HISTORY = 'Billing History loaded';
export const LOAD_BILLING_HISTORY_SUCCESS = 'Billing History loaded success';

export class LoadBillingHistory implements Action {
  readonly type: string = LOAD_BILLING_HISTORY;
  constructor(public payload: any) { }
}

export class LoadBillingHistorySuccess implements Action {
  readonly type: string = LOAD_BILLING_HISTORY_SUCCESS;
  constructor(public payload: any) { }
}

export type actions = LoadBillingHistory;
