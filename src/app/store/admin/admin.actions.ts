import { Action } from '@ngrx/store';
import { AdminSettings, UserInfoStats } from '../../models/settings.model';

export const LOAD_USERS = 'Users loaded';
export const LOAD_USERS_SUCCESS = 'Users loaded success';
export const LOAD_ADMIN_SETTINGS = 'Admin settings loaded';
export const LOAD_ADMIN_SETTINGS_SUCCESS = 'Admin settings loaded success';
export const SET_ADMIN_SETTINGS = 'Save new admin settings';

export class LoadUsers implements Action {
  readonly type: string = LOAD_USERS;
  constructor(public payload: any) { }
}

export class LoadUsersSuccess implements Action {
  readonly type: string = LOAD_USERS_SUCCESS;
  constructor(public payload: UserInfoStats[]) { }
}

export class LoadAdminSettings implements Action {
  readonly type: string = LOAD_ADMIN_SETTINGS;
  constructor(public payload: any) { }
}

export class LoadAdminSettingsSuccess implements Action {
  readonly type: string = LOAD_ADMIN_SETTINGS_SUCCESS;
  constructor(public payload: AdminSettings) { }
}

export class SetAdminSettings implements Action {
  readonly type: string = SET_ADMIN_SETTINGS;
  constructor(public payload: AdminSettings) { }
}

export type actions =
  LoadUsers |
  LoadUsersSuccess |
  LoadAdminSettings |
  LoadAdminSettingsSuccess |
  SetAdminSettings;
