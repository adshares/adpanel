import { Action } from '@ngrx/store';

import { User } from '../../models/user.model';

export const SET_USER = 'Set user';
export const UPDATE_USER_ETH_ADDRESS = 'User Ethereum Address updated';

export class SetUser implements Action {
  readonly type = SET_USER;
  constructor(public payload: User) { }
}

export class UpdateUserEthAddress implements Action {
  readonly type = UPDATE_USER_ETH_ADDRESS;

  constructor(public payload: string) { }
}

export type actions = SetUser | UpdateUserEthAddress;
