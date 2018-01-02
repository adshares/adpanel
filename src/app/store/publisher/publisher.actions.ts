import { Action } from '@ngrx/store';

export const LOAD_SITES = 'Sites loaded';
export const LOAD_SITES_SUCCESS = 'Sites loaded success';

export class LoadSites implements Action {
  readonly type: string = LOAD_SITES;
  constructor(public payload: any) { }
}

export class LoadSitesSuccess implements Action {
  readonly type: string = LOAD_SITES_SUCCESS;
  constructor(public payload: any) { }
}

export type actions = LoadSites | LoadSitesSuccess;
