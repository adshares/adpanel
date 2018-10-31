import { Action } from '@ngrx/store';

import { Site, AdUnit } from 'models/site.model';
import { AssetTargeting } from 'models/targeting-option.model';
import { TimespanFilter } from 'models/chart/chart-filter-settings.model';

export const LOAD_SITES = 'Sites loaded';
export const LOAD_SITES_SUCCESS = 'Sites loaded success';
export const LOAD_SITES_TOTALS = 'Sites totals loaded';
export const LOAD_SITES_TOTALS_SUCCESS = 'Sites totals loaded success';
export const CLEAR_LAST_EDITED_SITE = 'Last edited site cleared';
export const SET_LAST_EDITED_SITE = 'Last edited site set';
export const SAVE_LAST_EDITED_SITE = 'Basic site informations saved';
export const SAVE_LAST_EDITED_SITE_FILTERING = 'Site filtering saved';
export const SAVE_LAST_EDITED_SITE_AD_UNITS = 'Site ad units saved';
export const ADD_SITE_TO_SITES = 'Site added to user sites';
export const ADD_SITE_TO_SITES_SUCCESS = 'Site added to user sites success';

export class LoadSites implements Action {
  readonly type: string = LOAD_SITES;
  constructor(public payload: TimespanFilter) { }
}

export class LoadSitesSuccess implements Action {
  readonly type: string = LOAD_SITES_SUCCESS;
  constructor(public payload: any) { }
}

export class LoadSitesTotals implements Action {
  readonly type: string = LOAD_SITES_TOTALS;
  constructor(public payload: TimespanFilter) { }
}

export class LoadSitesTotalsSuccess implements Action {
  readonly type: string = LOAD_SITES_TOTALS_SUCCESS;
  constructor(public payload: any) { }
}

export class ClearLastEditedSite implements Action {
  readonly type: string = CLEAR_LAST_EDITED_SITE;
  constructor(public payload: any) { }
}

export class SetLastEditedSite implements Action {
  readonly type: string = SET_LAST_EDITED_SITE;
  constructor(public payload: Site) { }
}

export class SaveLastEditedSite implements Action {
  readonly type: string = SAVE_LAST_EDITED_SITE;
  constructor(public payload: Site) { }
}

export class SaveSiteFiltering implements Action {
  readonly type: string = SAVE_LAST_EDITED_SITE_FILTERING;
  constructor(public payload: AssetTargeting) { }
}

export class SaveLastEditedSiteAdUnits implements Action {
  readonly type: string = SAVE_LAST_EDITED_SITE_AD_UNITS;
  constructor(public payload: AdUnit[]) { }
}

export class AddSiteToSites implements Action {
  readonly type = ADD_SITE_TO_SITES;
  constructor(public payload: Site) { }
}

export class AddSiteToSitesSuccess implements Action {
  readonly type = ADD_SITE_TO_SITES_SUCCESS;
  constructor(public payload: Site) { }
}

export type actions =
  LoadSites |
  LoadSitesSuccess |
  LoadSitesTotals |
  LoadSitesTotalsSuccess |
  ClearLastEditedSite |
  SetLastEditedSite |
  SaveLastEditedSite |
  SaveSiteFiltering |
  SaveLastEditedSiteAdUnits |
  AddSiteToSites |
  AddSiteToSitesSuccess;
