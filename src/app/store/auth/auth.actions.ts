import { Action } from '@ngrx/store';

import { User } from 'models/user.model';

export const SET_USER = 'Set user';
export const UPDATE_USER_ETH_ADDRESS = 'User Address updated';
export const UPDATE_USER_AUTOMATIC_WITHDRAW_PERIOD = 'User Automatic Withdraw period updated';
export const UPDATE_USER_AUTOMATIC_WITHDRAW_AMOUNT = 'User Automatic Withdraw amount updated';

export class SetUser implements Action {
  readonly type = SET_USER;
  constructor(public payload: User) { }
}

export class UpdateUserEthAddress implements Action {
  readonly type = UPDATE_USER_ETH_ADDRESS;
  constructor(public payload: string) { }
}

export class UpdateUserAutomaticWithdrawPeriod implements Action {
  readonly type = UPDATE_USER_AUTOMATIC_WITHDRAW_PERIOD;
  constructor(public payload: number) { }
}

export class UpdateUserAutomaticWithdrawAmount implements Action {
  readonly type = UPDATE_USER_AUTOMATIC_WITHDRAW_AMOUNT;
  constructor(public payload: number) { }
}

export type actions =
  SetUser |
  UpdateUserEthAddress |
  UpdateUserAutomaticWithdrawPeriod |
  UpdateUserAutomaticWithdrawAmount;
