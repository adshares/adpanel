import { Action } from '@ngrx/store';

import { User } from '../../models/user.model';

export const LOGIN_USER = 'LOGIN_USER';
export const SET_ACTIVE_USER_TYPE = 'SET_ACTIVE_USER_TYPE';

export class LoginUser implements Action {
  readonly type = LOGIN_USER;

  constructor(public payload: User) { };
}

export class SetActiveUserType implements Action {
  readonly type = SET_ACTIVE_USER_TYPE;

  constructor(public payload: string) { };
}

export type actions = LoginUser | SetActiveUserType;
