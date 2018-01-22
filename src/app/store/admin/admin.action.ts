import { Action } from '@ngrx/store';

export const LOAD_USERS = 'Users loaded';
export const LOAD_USERS_SUCCESS = 'Users loaded success';
export const LOAD_ADMIN_SETTINGS = 'Admin settings loaded';
export const LOAD_ADMIN_SETTINGS_SUCCESS = 'Admin settings loaded success';

export class LoadUsers implements Action {
  readonly type: string = LOAD_USERS;
  constructor(public payload: any) { };
}

export class LoadUsersSuccess implements Action {
  readonly type: string = LOAD_USERS_SUCCESS;
  constructor(public payload: any) { };
}

export class LoadAdminSettings implements Action {
  readonly type: string = LOAD_ADMIN_SETTINGS;
  constructor(public payload: any) { };
}

export class LoadAdminSettingsSuccess implements Action {
  readonly type: string = LOAD_ADMIN_SETTINGS_SUCCESS;
  constructor(public payload: any) { };
}

export type actions =
  LoadUsers |
  LoadUsersSuccess |
  LoadAdminSettings |
  LoadAdminSettingsSuccess;
