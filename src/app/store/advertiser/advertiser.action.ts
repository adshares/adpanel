import { Action } from '@ngrx/store';
import { Campaign, CampaignBasicInformation, CampaignTargeting } from '../../models/campaign.model';

export const SAVE_CAMPAIGN_BASIC_INFORMATION = 'Basic Campaign Information saved';
export const SAVE_CAMPAING_TARGETING = 'Campaing targeting information saved';
export const LOAD_CAMPAIGNS = 'Campaigns loaded';
export const LOAD_CAMPAIGNS_SUCCESS = 'Campaigns loaded success';

export class SaveCampaignBasicInformation implements Action {
  readonly type = SAVE_CAMPAIGN_BASIC_INFORMATION;
  constructor(public payload: CampaignBasicInformation) { };
}

export class SaveCampaignTargeting implements Action {
  readonly type = SAVE_CAMPAING_TARGETING;
  constructor(public payload: CampaignTargeting) { };
}

export class LoadCampaigns implements Action {
  readonly type: string = LOAD_CAMPAIGNS;
  constructor(public payload: Campaign[]) { }
}

export class LoadCampaignsSuccess implements Action {
  readonly type: string = LOAD_CAMPAIGNS_SUCCESS;
  constructor(public payload: any) { }
}

export type actions = SaveCampaignBasicInformation | LoadCampaigns | LoadCampaignsSuccess;
