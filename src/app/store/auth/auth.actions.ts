import { Action } from '@ngrx/store';

import { User } from '../../models/user.model';

export const SET_USER = 'LOGIN_USER';

export class SetUser implements Action {
  readonly type = SET_USER;
  constructor(public payload: User) { }
}

export type actions = SetUser;
