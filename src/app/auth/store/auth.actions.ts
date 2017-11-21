import { Action } from '@ngrx/store';

import { UserModel } from './user.model'

export const LOGIN_USER = 'LOGIN_USER';

export class LoginUser implements Action {
  readonly type = LOGIN_USER;
  payload = UserModel;
}

export type AuthActions = LoginUser;
