import { Action } from '@ngrx/store';

export const SET_ACTIVE_USER_TYPE = 'SET_ACTIVE_USER_TYPE';

export class SetActiveUserType implements Action {
  readonly type = SET_ACTIVE_USER_TYPE;

  constructor(public payload: string) { }
}

export type actions = SetActiveUserType;
