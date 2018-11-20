import { Action } from '@ngrx/store';
import { Ad, Campaign, CampaignBasicInformation } from 'models/campaign.model';
import { AssetTargeting } from 'models/targeting-option.model';
import { TimespanFilter } from 'models/chart/chart-filter-settings.model';

export const CLEAR_LAST_EDITED_CAMPAIGN = 'Last edited campaign cleared';
export const SET_LAST_EDITED_CAMPAIGN = 'Last edited campaign set';
export const SAVE_CAMPAIGN_BASIC_INFORMATION = 'Basic Campaign Information saved';
export const SAVE_CAMPAIGN_TARGETING = 'Campaing targeting information saved';
export const SAVE_CAMPAIGN_ADS = 'Campaing ads saved';
export const ADD_CAMPAIGN_TO_CAMPAIGNS = 'Campaign added to user campaigns';
export const ADD_CAMPAIGN_TO_CAMPAIGNS_SUCCESS = 'Campaign added to user campaigns success';
export const LOAD_CAMPAIGNS = 'Campaigns loaded';
export const LOAD_CAMPAIGNS_SUCCESS = 'Campaigns loaded success';
export const LOAD_CAMPAIGNS_TOTALS = 'Campaigns totals loaded';
export const LOAD_CAMPAIGNS_TOTALS_SUCCESS = 'Campaigns totals loaded success';

export class ClearLastEditedCampaign implements Action {
  readonly type = CLEAR_LAST_EDITED_CAMPAIGN;

  constructor(public payload?: any) {
  }
}

export class SetLastEditedCampaign implements Action {
  readonly type = SET_LAST_EDITED_CAMPAIGN;

  constructor(public payload: Campaign) {
  }
}

export class SaveCampaignBasicInformation implements Action {
  readonly type = SAVE_CAMPAIGN_BASIC_INFORMATION;

  constructor(public payload: CampaignBasicInformation) {
  }
}

export class SaveCampaignTargeting implements Action {
  readonly type = SAVE_CAMPAIGN_TARGETING;

  constructor(public payload: AssetTargeting) {
  }
}

export class SaveCampaignAds implements Action {
  readonly type = SAVE_CAMPAIGN_ADS;

  constructor(public payload: Ad[]) {
  }
}

export class AddCampaignToCampaigns implements Action {
  readonly type = ADD_CAMPAIGN_TO_CAMPAIGNS;

  constructor(public payload: Campaign) {
  }
}

export class AddCampaignToCampaignsSuccess implements Action {
  readonly type = ADD_CAMPAIGN_TO_CAMPAIGNS_SUCCESS;

  constructor(public payload: Campaign) {
  }
}

export class LoadCampaigns implements Action {
  readonly type: string = LOAD_CAMPAIGNS;

  constructor(public payload: TimespanFilter) {
  }
}

export class LoadCampaignsSuccess implements Action {
  readonly type: string = LOAD_CAMPAIGNS_SUCCESS;

  constructor(public payload: any) {
  }
}

export class LoadCampaignsTotals implements Action {
  readonly type: string = LOAD_CAMPAIGNS_TOTALS;

  constructor(public payload: TimespanFilter) {
  }
}

export class LoadCampaignsTotalsSuccess implements Action {
  readonly type: string = LOAD_CAMPAIGNS_TOTALS_SUCCESS;

  constructor(public payload: any) {
  }
}

export type actions =
  ClearLastEditedCampaign |
  SetLastEditedCampaign |
  SaveCampaignBasicInformation |
  SaveCampaignTargeting |
  SaveCampaignAds |
  AddCampaignToCampaigns |
  AddCampaignToCampaignsSuccess |
  LoadCampaigns |
  LoadCampaignsSuccess |
  LoadCampaignsTotals |
  LoadCampaignsTotalsSuccess;
