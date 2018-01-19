import { Action } from '@ngrx/store';
import { Campaign, CampaignBasicInformation, CampaignTargeting, Ad } from '../../models/campaign.model';

export const CLEAR_LAST_EDITED_CAMPAIGN = 'Last edited campaign cleared';
export const SAVE_CAMPAIGN_BASIC_INFORMATION = 'Basic Campaign Information saved';
export const SAVE_CAMPAIGN_TARGETING = 'Campaing targeting information saved';
export const SAVE_CAMPAIGN_ADS = 'Campaing ads saved';
export const ADD_CAMPAIGN_TO_CAMPAIGNS = 'Campaign added to user campaigns';
export const LOAD_CAMPAIGNS = 'Campaigns loaded';
export const LOAD_CAMPAIGNS_SUCCESS = 'Campaigns loaded success';

export class ClearLastEditedCampaign implements Action {
  readonly type = CLEAR_LAST_EDITED_CAMPAIGN;
  constructor(public payload: any) { };
}

export class SaveCampaignBasicInformation implements Action {
  readonly type = SAVE_CAMPAIGN_BASIC_INFORMATION;
  constructor(public payload: CampaignBasicInformation) { };
}

export class SaveCampaignTargeting implements Action {
  readonly type = SAVE_CAMPAIGN_TARGETING;
  constructor(public payload: CampaignTargeting) { };
}

export class SaveCampaignAds implements Action {
  readonly type = SAVE_CAMPAIGN_ADS;
  constructor(public payload: Ad[]) { };
}

export class addCampaignToCampaigns implements Action {
  readonly type = ADD_CAMPAIGN_TO_CAMPAIGNS;
  constructor(public payload: Campaign) { };
}

export class LoadCampaigns implements Action {
  readonly type: string = LOAD_CAMPAIGNS;
  constructor(public payload: any) { };
}

export class LoadCampaignsSuccess implements Action {
  readonly type: string = LOAD_CAMPAIGNS_SUCCESS;
  constructor(public payload: any) { };
}

export type actions =
  ClearLastEditedCampaign |
  SaveCampaignBasicInformation |
  SaveCampaignTargeting |
  SaveCampaignAds |
  addCampaignToCampaigns |
  LoadCampaigns |
  LoadCampaignsSuccess;
