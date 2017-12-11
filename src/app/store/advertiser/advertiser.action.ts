import { Action } from '@ngrx/store';

export const SAVE_CAMPAIGN_BASIC_INFORMATION = 'Basic Campaign Information saved';
export const LOAD_CAMPAIGNS = 'Campaigns loaded';
export const LOAD_CAMPAIGNS_SUCCESS = 'Campaigns loaded success';

export class SaveCampaignBasicInformation implements Action {
  readonly type = SAVE_CAMPAIGN_BASIC_INFORMATION;
  constructor(public payload: any) { };
}

export class LoadCampaigns implements Action {
  readonly type: string = LOAD_CAMPAIGNS;
  constructor(public payload: any) { }
}

export class LoadCampaignsSuccess implements Action {
  readonly type: string = LOAD_CAMPAIGNS_SUCCESS;
  constructor(public payload: any) { }
}

export type actions = SaveCampaignBasicInformation;
