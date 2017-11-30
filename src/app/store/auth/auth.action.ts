import { Action } from '@ngrx/store';

import { UserModel } from '../../model/user.model';

export const LOGIN_USER = 'LOGIN_USER';

export class LoginUser implements Action {
  readonly type = LOGIN_USER;

  constructor(public payload: UserModel) { };
}

export type actions = LoginUser;
