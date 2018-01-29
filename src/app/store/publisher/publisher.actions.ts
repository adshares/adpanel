import { Action } from '@ngrx/store';

import { Site, AdUnit } from '../../models/site.model';

export const LOAD_SITES = 'Sites loaded';
export const LOAD_SITES_SUCCESS = 'Sites loaded success';
export const SAVE_LAST_EDITED_SITE = 'Basic site informations saved';
export const SAVE_LAST_EDITED_SITE_AD_UNITS = 'Site ad units saved';
export const ADD_SITE_TO_SITES = 'Site added to user sites';

export class LoadSites implements Action {
  readonly type: string = LOAD_SITES;
  constructor(public payload: any) { }
}

export class LoadSitesSuccess implements Action {
  readonly type: string = LOAD_SITES_SUCCESS;
  constructor(public payload: any) { }
}

export class SaveLastEditedSite implements Action {
  readonly type: string = SAVE_LAST_EDITED_SITE;
  constructor(public payload: Site) { }
}

export class SaveLastEditedSiteAdUnits implements Action {
  readonly type: string = SAVE_LAST_EDITED_SITE_AD_UNITS;
  constructor(public payload: AdUnit[]) { }
}

export class AddSiteToSites implements Action {
  readonly type = ADD_SITE_TO_SITES;
  constructor(public payload: Site) { };
}

export type actions = LoadSites | LoadSitesSuccess | SaveLastEditedSite | AddSiteToSites;
