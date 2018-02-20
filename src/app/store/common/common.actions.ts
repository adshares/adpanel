import { Action } from '@ngrx/store';

export const SET_ACTIVE_USER_TYPE = 'Set active user type';

export class SetActiveUserType implements Action {
  readonly type = SET_ACTIVE_USER_TYPE;

  constructor(public payload: number) { }
}

export type actions = SetActiveUserType;
