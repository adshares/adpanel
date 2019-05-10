import { Action } from '@ngrx/store';
import { User } from 'models/user.model';

export const SET_USER = 'Set user';
export const SET_USER_SUCCESS = 'Set user success';
export const SET_USER_FAILURE = 'Set user failure';

export const UPDATE_USER_ADDRESS = 'User Address updated';

export const UPDATE_USER_AUTOMATIC_WITHDRAW_PERIOD = 'User Automatic Withdraw period updated';
export const UPDATE_USER_AUTOMATIC_WITHDRAW_AMOUNT = 'User Automatic Withdraw amount updated';

export const USER_LOG_OUT_SUCCESS = 'User logged out success';
export const USER_LOG_IN_SUCCESS = 'User logged in success';
export const IMPERSONATE_USER = 'User impersonation success';
export const DROP_IMPERSONATION_TOKEN = 'Drop user impersonation token success';

export class ImpersonateUser implements Action {
  readonly type = IMPERSONATE_USER;

  constructor(public payload: string) {
  }
}

export class DropImpersonationToken implements Action {
  readonly type = DROP_IMPERSONATION_TOKEN;

  constructor(public payload?: any) {
  }
}

export class SetUser implements Action {
  readonly type = SET_USER;

  constructor(public payload?: User) {
  }
}

export class SetUserSuccess implements Action {
  readonly type = SET_USER_SUCCESS;

  constructor(public payload: User) {
  }
}

export class SetUserFailure implements Action {
  readonly type = SET_USER_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateUserAddress implements Action {
  readonly type = UPDATE_USER_ADDRESS;

  constructor(public payload: string) {
  }
}

export class UpdateUserAutomaticWithdrawPeriod implements Action {
  readonly type = UPDATE_USER_AUTOMATIC_WITHDRAW_PERIOD;

  constructor(public payload: number) {
  }
}

export class UpdateUserAutomaticWithdrawAmount implements Action {
  readonly type = UPDATE_USER_AUTOMATIC_WITHDRAW_AMOUNT;

  constructor(public payload: number) {
  }
}

export class UserLogOutSuccess implements Action {
  readonly type = USER_LOG_OUT_SUCCESS;

  constructor(public payload?: number) {
  }
}

export class UserLogInSuccess implements Action {
  readonly type = USER_LOG_IN_SUCCESS;

  constructor(public payload?: any) {
  }
}


export type actions = SetUser
  | DropImpersonationToken
  | ImpersonateUser
  | SetUserSuccess
  | SetUserFailure
  | UpdateUserAddress
  | UpdateUserAutomaticWithdrawPeriod
  | UpdateUserAutomaticWithdrawAmount
  | UserLogOutSuccess
  | UserLogInSuccess;
