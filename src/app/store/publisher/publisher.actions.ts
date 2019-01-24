import { Action } from '@ngrx/store';

import { AdUnit, Site, SiteLanguage } from 'models/site.model';
import {AssetTargeting, TargetingOption} from 'models/targeting-option.model';
import { TimespanFilter } from 'models/chart/chart-filter-settings.model';

export const GET_LANGUAGES_LIST = 'Getting languages';
export const GET_LANGUAGES_LIST_SUCCESS = 'Languages list loaded';
export const GET_LANGUAGES_LIST_FAILURE = 'Languages loading failure';
export const GET_FILTERING_CRITERIA = 'Getting filtering criteria';
export const GET_FILTERING_CRITERIA_SUCCESS = 'Filtering criteria loaded';
export const GET_FILTERING_CRITERIA_FAILURE = 'Filtering criteria loading failure';
export const LOAD_SITES = 'Sites loaded';
export const LOAD_SITES_SUCCESS = 'Sites loaded success';
export const LOAD_SITES_TOTALS = 'Sites totals loaded';
export const LOAD_SITES_TOTALS_SUCCESS = 'Sites totals loaded success';
export const LOAD_SITES_TOTALS_FAILURE = 'Sites totals loaded failure';
export const CLEAR_LAST_EDITED_SITE = 'Last edited site cleared';
export const SET_LAST_EDITED_SITE = 'Last edited site set';
export const SAVE_LAST_EDITED_SITE = 'Basic site informations saved';
export const SAVE_LAST_EDITED_SITE_FILTERING = 'Site filtering saved';
export const SAVE_LAST_EDITED_SITE_AD_UNITS = 'Site ad units saved';
export const ADD_SITE_TO_SITES = 'Site added to user sites';
export const ADD_SITE_TO_SITES_SUCCESS = 'Site added to user sites success';
export const UPDATE_SITE = 'Campaign update';
export const UPDATE_SITE_SUCCESS = 'Campaign update success';
export const UPDATE_SITE_FAILURE = 'Campaign update success';
export const UPDATE_SITE_FILTERING = 'Campaign update';
export const UPDATE_SITE_FILTERING_SUCCESS = 'Campaign update success';
export const UPDATE_SITE_FILTERING_FAILURE = 'Campaign update success';

export class LoadSites implements Action {
  readonly type: string = LOAD_SITES;

  constructor(public payload: TimespanFilter) {
  }
}

export class LoadSitesSuccess implements Action {
  readonly type: string = LOAD_SITES_SUCCESS;

  constructor(public payload: any) {
  }
}

export class LoadSitesTotals implements Action {
  readonly type: string = LOAD_SITES_TOTALS;

  constructor(public payload: any) {
  }
}

export class LoadSitesTotalsSuccess implements Action {
  readonly type: string = LOAD_SITES_TOTALS_SUCCESS;

  constructor(public payload: any) {
  }
}

export class LoadSitesTotalsFailure implements Action {
  readonly type: string = LOAD_SITES_TOTALS_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ClearLastEditedSite implements Action {
  readonly type: string = CLEAR_LAST_EDITED_SITE;

  constructor(public payload?: any) {
  }
}

export class SetLastEditedSite implements Action {
  readonly type: string = SET_LAST_EDITED_SITE;

  constructor(public payload: Site) {
  }
}

export class SaveLastEditedSite implements Action {
  readonly type: string = SAVE_LAST_EDITED_SITE;

  constructor(public payload: Site) {
  }
}

export class SaveSiteFiltering implements Action {
  readonly type: string = SAVE_LAST_EDITED_SITE_FILTERING;

  constructor(public payload: AssetTargeting) {
  }
}

export class SaveLastEditedSiteAdUnits implements Action {
  readonly type: string = SAVE_LAST_EDITED_SITE_AD_UNITS;

  constructor(public payload: AdUnit[]) {
  }
}

export class AddSiteToSites implements Action {
  readonly type = ADD_SITE_TO_SITES;

  constructor(public payload: Site) {
  }
}

export class AddSiteToSitesSuccess implements Action {
  readonly type = ADD_SITE_TO_SITES_SUCCESS;

  constructor(public payload: Site) {
  }
}

export class GetLanguagesList implements Action {
  readonly type = GET_LANGUAGES_LIST;

  constructor(public payload?: any) {
  }
}

export class GetLanguagesListSuccess implements Action {
  readonly type = GET_LANGUAGES_LIST_SUCCESS;

  constructor(public payload: SiteLanguage[]) {
  }
}

export class GetLanguagesListFailure implements Action {
  readonly type = GET_LANGUAGES_LIST_FAILURE;

  constructor(public payload: any) {
  }
}
export class GetFilteringCriteria implements Action {
  readonly type = GET_FILTERING_CRITERIA;

  constructor(public payload?: any) {
  }
}

export class GetFilteringCriteriaSuccess implements Action {
  readonly type = GET_FILTERING_CRITERIA_SUCCESS;

  constructor(public payload: TargetingOption[]) {
  }
}

export class GetFilteringCriteriaFailure implements Action {
  readonly type = GET_FILTERING_CRITERIA_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateSite implements Action {
  readonly type = UPDATE_SITE;

  constructor(public payload: Site) {
  }
}

export class UpdateSiteSuccess implements Action {
  readonly type = UPDATE_SITE_SUCCESS;

  constructor(public payload: Site) {
  }
}

export class UpdateSiteFailure implements Action {
  readonly type = UPDATE_SITE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateSiteFiltering implements Action {
  readonly type = UPDATE_SITE_FILTERING;

  constructor(public payload: Site) {
  }
}

export class UpdateSiteFilteringSuccess implements Action {
  readonly type = UPDATE_SITE_FILTERING_SUCCESS;

  constructor(public payload: Site) {
  }
}

export class UpdateSiteFilteringFailure implements Action {
  readonly type = UPDATE_SITE_FILTERING_FAILURE;

  constructor(public payload?: any) {
  }
}

export type actions =
  GetLanguagesList |
  GetLanguagesListSuccess |
  GetLanguagesListFailure |
  GetFilteringCriteria |
  GetFilteringCriteriaSuccess |
  GetFilteringCriteriaFailure |
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
  AddSiteToSitesSuccess |
  LoadSitesTotalsFailure |
  UpdateSite |
  UpdateSiteSuccess |
  UpdateSiteFailure |
  UpdateSiteFiltering |
  UpdateSiteFilteringSuccess |
  UpdateSiteFilteringFailure;
