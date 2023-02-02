import { Action } from '@ngrx/store';
import { Ad, Campaign, CampaignBasicInformation, CampaignsConfig, CampaignTotalsResponse } from 'models/campaign.model';
import { AssetTargeting } from 'models/targeting-option.model';
import { TimespanFilter } from 'models/chart/chart-filter-settings.model';

export const CLEAR_LAST_EDITED_CAMPAIGN = 'Last edited campaign cleared';
export const SET_LAST_EDITED_CAMPAIGN = 'Last edited campaign set';
export const SAVE_CAMPAIGN_BASIC_INFORMATION = 'Basic Campaign Information saved';
export const SAVE_CAMPAIGN_TARGETING = 'Campaign targeting information saved';
export const SAVE_CAMPAIGN_ADS = 'Campaign ads saved';
export const SAVE_CONVERSION = 'Save conversion';

export const ADD_CAMPAIGN_TO_CAMPAIGNS = 'Campaign added to user campaigns';
export const ADD_CAMPAIGN_TO_CAMPAIGNS_SUCCESS = 'Campaign added to user campaigns success';

export const LOAD_CAMPAIGNS = 'Campaigns loading';
export const LOAD_CAMPAIGNS_SUCCESS = 'Campaigns loading success';
export const LOAD_CAMPAIGNS_FAILURE = 'Campaigns loading failure';

export const LOAD_CAMPAIGN = 'Campaign loading';
export const LOAD_CAMPAIGN_SUCCESS = 'Campaign loading success';
export const LOAD_CAMPAIGN_FAILURE = 'Campaign loading failure';

export const LOAD_CAMPAIGNS_CONFIG = 'Campaigns config loading';
export const LOAD_CAMPAIGNS_CONFIG_SUCCESS = 'Campaigns config loading success';
export const LOAD_CAMPAIGNS_CONFIG_FAILURE = 'Campaigns config loading failure';

export const LOAD_CAMPAIGN_TOTALS = 'Campaign totals loading';
export const LOAD_CAMPAIGN_TOTALS_SUCCESS = 'Campaign totals loading success';
export const LOAD_CAMPAIGN_TOTALS_FAILURE = 'Campaign totals loading failure';

export const LOAD_CAMPAIGNS_TOTALS = 'Campaigns totals loading';
export const LOAD_CAMPAIGNS_TOTALS_SUCCESS = 'Campaigns totals loading success';
export const LOAD_CAMPAIGNS_TOTALS_FAILURE = 'Campaigns totals loading failure';

export const UPDATE_CAMPAIGN = 'Update campaign';
export const UPDATE_CAMPAIGN_SUCCESS = 'Update campaign success';
export const UPDATE_CAMPAIGN_FAILURE = 'Update campaign failure';

export const UPDATE_CAMPAIGN_STATUS = 'Update campaign status';
export const UPDATE_CAMPAIGN_STATUS_SUCCESS = 'Update campaign status success';

export const ACTIVATE_OUTDATED_CAMPAIGN = 'Activate outdated campaign';
export const ACTIVATE_OUTDATED_CAMPAIGN_SUCCESS = ACTIVATE_OUTDATED_CAMPAIGN + ' success';

export const CLONE_CAMPAIGN = 'Clone campaign';
export const CLONE_CAMPAIGN_SUCCESS = 'Clone campaign success';
export const CLONE_CAMPAIGN_FAILURE = 'Clone campaign failure';

export const DELETE_CAMPAIGN = 'Delete campaign';
export const DELETE_CAMPAIGN_SUCCESS = 'Delete campaign success';

export class ClearLastEditedCampaign implements Action {
  readonly type = CLEAR_LAST_EDITED_CAMPAIGN;

  constructor(public payload?: any) {}
}

export class SetLastEditedCampaign implements Action {
  readonly type = SET_LAST_EDITED_CAMPAIGN;

  constructor(public payload: Campaign) {}
}

export class SaveCampaignBasicInformation implements Action {
  readonly type = SAVE_CAMPAIGN_BASIC_INFORMATION;

  constructor(public payload: CampaignBasicInformation) {}
}

export class SaveCampaignTargeting implements Action {
  readonly type = SAVE_CAMPAIGN_TARGETING;

  constructor(public payload: AssetTargeting) {}
}

export class SaveCampaignAds implements Action {
  readonly type = SAVE_CAMPAIGN_ADS;

  constructor(public payload: Ad[]) {}
}

export class SaveConversion implements Action {
  readonly type = SAVE_CONVERSION;

  constructor(public payload: Campaign) {}
}

export class UpdateCampaign implements Action {
  readonly type = UPDATE_CAMPAIGN;

  constructor(public payload: Campaign) {}
}

export class UpdateCampaignSuccess implements Action {
  readonly type = UPDATE_CAMPAIGN_SUCCESS;

  constructor(public payload: Campaign) {}
}

export class UpdateCampaignFailure implements Action {
  readonly type = UPDATE_CAMPAIGN_FAILURE;

  constructor(public payload?: any) {}
}

export class UpdateCampaignStatus implements Action {
  readonly type = UPDATE_CAMPAIGN_STATUS;

  constructor(public payload: { id: number; status: number }) {}
}

export class UpdateCampaignStatusSuccess implements Action {
  readonly type = UPDATE_CAMPAIGN_STATUS_SUCCESS;

  constructor(public payload?: Campaign) {}
}

export class ActivateOutdatedCampaignStatus implements Action {
  readonly type = ACTIVATE_OUTDATED_CAMPAIGN;

  constructor(public payload: { campaignId: number }) {}
}

export class ActivateOutdatedCampaignStatusSuccess implements Action {
  readonly type = ACTIVATE_OUTDATED_CAMPAIGN_SUCCESS;

  constructor(public payload: { campaignId: number }) {}
}

export class AddCampaignToCampaigns implements Action {
  readonly type = ADD_CAMPAIGN_TO_CAMPAIGNS;

  constructor(public payload: Campaign) {}
}

export class AddCampaignToCampaignsSuccess implements Action {
  readonly type = ADD_CAMPAIGN_TO_CAMPAIGNS_SUCCESS;

  constructor(public payload: Campaign) {}
}

export class LoadCampaigns implements Action {
  readonly type: string = LOAD_CAMPAIGNS;

  constructor(public payload?: any) {}
}

export class LoadCampaignsSuccess implements Action {
  readonly type: string = LOAD_CAMPAIGNS_SUCCESS;

  constructor(public payload: Campaign[]) {}
}

export class LoadCampaignsFailure implements Action {
  readonly type: string = LOAD_CAMPAIGNS_FAILURE;

  constructor(public payload?: any) {}
}

export class LoadCampaign implements Action {
  readonly type: string = LOAD_CAMPAIGN;

  constructor(public payload?: number) {}
}

export class LoadCampaignSuccess implements Action {
  readonly type: string = LOAD_CAMPAIGN_SUCCESS;

  constructor(public payload: Campaign) {}
}

export class LoadCampaignFailure implements Action {
  readonly type: string = LOAD_CAMPAIGN_FAILURE;

  constructor(public payload?: any) {}
}

export class LoadCampaignsConfig implements Action {
  readonly type: string = LOAD_CAMPAIGNS_CONFIG;

  constructor(public payload?: any) {}
}

export class LoadCampaignsConfigSuccess implements Action {
  readonly type: string = LOAD_CAMPAIGNS_CONFIG_SUCCESS;

  constructor(public payload: CampaignsConfig) {}
}

export class LoadCampaignsConfigFailure implements Action {
  readonly type: string = LOAD_CAMPAIGNS_CONFIG_FAILURE;

  constructor(public payload?: any) {}
}

export class LoadCampaignsTotals implements Action {
  readonly type: string = LOAD_CAMPAIGNS_TOTALS;

  constructor(public payload: TimespanFilter & { filter: any }) {}
}

export class LoadCampaignsTotalsSuccess implements Action {
  readonly type: string = LOAD_CAMPAIGNS_TOTALS_SUCCESS;

  constructor(public payload: any) {}
}

export class LoadCampaignsTotalsFailure implements Action {
  readonly type: string = LOAD_CAMPAIGNS_TOTALS_FAILURE;

  constructor(public payload?: any) {}
}

export class LoadCampaignTotals implements Action {
  readonly type: string = LOAD_CAMPAIGN_TOTALS;

  constructor(public payload: { from: string; to: string; id: number }) {}
}

export class LoadCampaignTotalsSuccess implements Action {
  readonly type: string = LOAD_CAMPAIGN_TOTALS_SUCCESS;

  constructor(public payload: CampaignTotalsResponse) {}
}

export class LoadCampaignTotalsFailure implements Action {
  readonly type: string = LOAD_CAMPAIGN_TOTALS_FAILURE;

  constructor(public payload?: any) {}
}

export class CloneCampaign implements Action {
  readonly type: string = CLONE_CAMPAIGN;

  constructor(public payload: number) {}
}

export class CloneCampaignSuccess implements Action {
  readonly type: string = CLONE_CAMPAIGN_SUCCESS;

  constructor(public payload: any) {}
}

export class CloneCampaignFailure implements Action {
  readonly type: string = CLONE_CAMPAIGN_FAILURE;

  constructor(public payload?: any) {}
}

export class DeleteCampaign implements Action {
  readonly type: string = DELETE_CAMPAIGN;

  constructor(public payload: number) {}
}

export class DeleteCampaignSuccess implements Action {
  readonly type: string = DELETE_CAMPAIGN_SUCCESS;

  constructor(public payload: any) {}
}

export type actions =
  | ClearLastEditedCampaign
  | SetLastEditedCampaign
  | SaveCampaignBasicInformation
  | SaveCampaignTargeting
  | SaveCampaignAds
  | SaveConversion
  | AddCampaignToCampaigns
  | AddCampaignToCampaignsSuccess
  | LoadCampaigns
  | LoadCampaignsSuccess
  | LoadCampaignsFailure
  | LoadCampaign
  | LoadCampaignSuccess
  | LoadCampaignFailure
  | LoadCampaignsConfig
  | LoadCampaignsConfigSuccess
  | LoadCampaignsConfigFailure
  | LoadCampaignTotals
  | LoadCampaignTotalsSuccess
  | LoadCampaignTotalsFailure
  | LoadCampaignsTotals
  | LoadCampaignsTotalsSuccess
  | LoadCampaignsTotalsFailure
  | UpdateCampaign
  | UpdateCampaignSuccess
  | UpdateCampaignFailure
  | DeleteCampaign
  | DeleteCampaignSuccess
  | UpdateCampaignStatus
  | UpdateCampaignStatusSuccess
  | ActivateOutdatedCampaignStatus
  | ActivateOutdatedCampaignStatusSuccess;
