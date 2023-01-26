import { Action } from '@ngrx/store';
import { AdUnit, Site, SiteLanguage } from 'models/site.model';
import { AssetTargeting } from 'models/targeting-option.model';
import { TimespanFilter } from 'models/chart/chart-filter-settings.model';

export const GET_LANGUAGES_LIST = 'Getting languages';
export const GET_LANGUAGES_LIST_SUCCESS = 'Languages list loading success';
export const GET_LANGUAGES_LIST_FAILURE = 'Languages loading failure';

export const LOAD_SITE = 'Site loading';
export const LOAD_SITE_SUCCESS = 'Site loading success';
export const LOAD_SITE_FAILURE = 'Site loading failure';

export const LOAD_SITES = 'Sites loading';
export const LOAD_SITES_SUCCESS = 'Sites loading success';
export const LOAD_SITES_FAILURE = 'Sites loading failure';

export const LOAD_SITE_TOTALS = 'Site totals loading';
export const LOAD_SITE_TOTALS_SUCCESS = 'Site totals loading success';
export const LOAD_SITE_TOTALS_FAILURE = 'Site totals loading failure';

export const LOAD_SITES_TOTALS = 'Sites totals loading';
export const LOAD_SITES_TOTALS_SUCCESS = 'Sites totals loading success';
export const LOAD_SITES_TOTALS_FAILURE = 'Sites totals loading failure';

export const CLEAR_LAST_EDITED_SITE = 'Last edited site cleared';
export const SET_LAST_EDITED_SITE = 'Last edited site set';
export const SAVE_LAST_EDITED_SITE = 'Basic site informations saved';
export const SAVE_LAST_EDITED_SITE_FILTERING = 'Site filtering saved';
export const SAVE_LAST_EDITED_SITE_ONLY_ACCEPTED_BANNERS = 'Site only accepted banners saved';
export const SAVE_LAST_EDITED_SITE_AD_UNITS = 'Site placements saved';

export const ADD_SITE_TO_SITES = 'Save site';
export const ADD_SITE_TO_SITES_SUCCESS = 'Save site success';

export const UPDATE_SITE = 'Site update';
export const UPDATE_SITE_SUCCESS = 'Site update success';
export const UPDATE_SITE_FAILURE = 'Site update failure';

export const UPDATE_SITE_STATUS = 'Update site status';
export const UPDATE_SITE_STATUS_SUCCESS = 'Update site status success';

export const UPDATE_SITE_FILTERING = 'Site filtering update';
export const UPDATE_SITE_FILTERING_SUCCESS = 'Site filtering update success';
export const UPDATE_SITE_FILTERING_FAILURE = 'Site filtering update failure';

export const UPDATE_SITE_UNITS = 'Site units update';
export const UPDATE_SITE_UNITS_SUCCESS = 'Site units update success';

export class LoadSites implements Action {
  readonly type: string = LOAD_SITES;

  constructor(public payload: TimespanFilter) {}
}

export class LoadSitesSuccess implements Action {
  readonly type: string = LOAD_SITES_SUCCESS;

  constructor(public payload: any) {}
}

export class LoadSitesFailure implements Action {
  readonly type: string = LOAD_SITES_FAILURE;

  constructor(public payload: any) {}
}

export class LoadSite implements Action {
  readonly type: string = LOAD_SITE;

  constructor(public payload?: number) {}
}

export class LoadSiteSuccess implements Action {
  readonly type: string = LOAD_SITE_SUCCESS;

  constructor(public payload: Site) {}
}

export class LoadSiteFailure implements Action {
  readonly type: string = LOAD_SITE_FAILURE;

  constructor(public payload?: any) {}
}

export class LoadSitesTotals implements Action {
  readonly type: string = LOAD_SITES_TOTALS;

  constructor(public payload: { from: string; to: string }) {}
}

export class LoadSitesTotalsSuccess implements Action {
  readonly type: string = LOAD_SITES_TOTALS_SUCCESS;

  constructor(public payload: any) {}
}

export class LoadSitesTotalsFailure implements Action {
  readonly type: string = LOAD_SITES_TOTALS_FAILURE;

  constructor(public payload?: any) {}
}

export class LoadSiteTotals implements Action {
  readonly type: string = LOAD_SITE_TOTALS;

  constructor(public payload: { from: string; to: string; id: number }) {}
}

export class LoadSiteTotalsSuccess implements Action {
  readonly type: string = LOAD_SITE_TOTALS_SUCCESS;

  constructor(public payload: any) {}
}

export class LoadSiteTotalsFailure implements Action {
  readonly type: string = LOAD_SITE_TOTALS_FAILURE;

  constructor(public payload?: any) {}
}

export class ClearLastEditedSite implements Action {
  readonly type: string = CLEAR_LAST_EDITED_SITE;

  constructor(public payload?: any) {}
}

export class SetLastEditedSite implements Action {
  readonly type: string = SET_LAST_EDITED_SITE;

  constructor(public payload: Site) {}
}

export class SaveLastEditedSite implements Action {
  readonly type: string = SAVE_LAST_EDITED_SITE;

  constructor(public payload: Site) {}
}

export class SaveSiteFiltering implements Action {
  readonly type: string = SAVE_LAST_EDITED_SITE_FILTERING;

  constructor(public payload: AssetTargeting) {}
}

export class SaveSiteOnlyAcceptedBanners implements Action {
  readonly type: string = SAVE_LAST_EDITED_SITE_ONLY_ACCEPTED_BANNERS;

  constructor(public payload: boolean) {}
}

export class SaveLastEditedSiteAdUnits implements Action {
  readonly type: string = SAVE_LAST_EDITED_SITE_AD_UNITS;

  constructor(public payload: AdUnit[]) {}
}

export class AddSiteToSites implements Action {
  readonly type = ADD_SITE_TO_SITES;

  constructor(public payload: Site) {}
}

export class AddSiteToSitesSuccess implements Action {
  readonly type = ADD_SITE_TO_SITES_SUCCESS;

  constructor(public payload: Site) {}
}

export class GetLanguagesList implements Action {
  readonly type = GET_LANGUAGES_LIST;

  constructor(public payload?: any) {}
}

export class GetLanguagesListSuccess implements Action {
  readonly type = GET_LANGUAGES_LIST_SUCCESS;

  constructor(public payload: SiteLanguage[]) {}
}

export class GetLanguagesListFailure implements Action {
  readonly type = GET_LANGUAGES_LIST_FAILURE;

  constructor(public payload?: any) {}
}

export class UpdateSite implements Action {
  readonly type = UPDATE_SITE;

  constructor(public payload: Partial<Site>) {}
}

export class UpdateSiteSuccess implements Action {
  readonly type = UPDATE_SITE_SUCCESS;

  constructor(public payload: Partial<Site>) {}
}

export class UpdateSiteFailure implements Action {
  readonly type = UPDATE_SITE_FAILURE;

  constructor(public payload?: any) {}
}

export class UpdateSiteStatus implements Action {
  readonly type = UPDATE_SITE_STATUS;

  constructor(public payload: Partial<Site>) {}
}

export class UpdateSiteStatusSuccess implements Action {
  readonly type = UPDATE_SITE_STATUS_SUCCESS;

  constructor(public payload: Partial<Site>) {}
}

export class UpdateSiteFiltering implements Action {
  readonly type = UPDATE_SITE_FILTERING;

  constructor(public payload: Site) {}
}

export class UpdateSiteFilteringSuccess implements Action {
  readonly type = UPDATE_SITE_FILTERING_SUCCESS;

  constructor(public payload: Site) {}
}

export class UpdateSiteFilteringFailure implements Action {
  readonly type = UPDATE_SITE_FILTERING_FAILURE;

  constructor(public payload?: any) {}
}

export class UpdateSiteUnits implements Action {
  readonly type = UPDATE_SITE_UNITS;

  constructor(public payload: Site) {}
}

export class UpdateSiteUnitsSuccess implements Action {
  readonly type = UPDATE_SITE_UNITS_SUCCESS;

  constructor(public payload?: Site) {}
}

export type actions =
  | GetLanguagesList
  | GetLanguagesListSuccess
  | GetLanguagesListFailure
  | LoadSite
  | LoadSiteSuccess
  | LoadSiteFailure
  | LoadSitesTotals
  | LoadSitesTotalsSuccess
  | LoadSitesTotalsFailure
  | LoadSites
  | LoadSitesSuccess
  | LoadSitesFailure
  | LoadSiteTotals
  | LoadSiteTotalsSuccess
  | LoadSiteTotalsFailure
  | ClearLastEditedSite
  | SetLastEditedSite
  | SaveLastEditedSite
  | SaveSiteFiltering
  | SaveLastEditedSiteAdUnits
  | AddSiteToSites
  | AddSiteToSitesSuccess
  | UpdateSite
  | UpdateSiteSuccess
  | UpdateSiteFailure
  | UpdateSiteStatus
  | UpdateSiteStatusSuccess
  | UpdateSiteFiltering
  | UpdateSiteFilteringSuccess
  | UpdateSiteFilteringFailure
  | UpdateSiteUnits
  | UpdateSiteUnitsSuccess;
