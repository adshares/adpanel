import { Action } from '@ngrx/store';

export const SAVE_CAMPAIGN_BASIC_INFORMATION = 'SAVE_CAMPAIGN_BASIC_INFORMATION';

export class SaveCampaignBasicInformation implements Action {
  readonly type = SAVE_CAMPAIGN_BASIC_INFORMATION;

  constructor(public payload: any) { };
}

export type actions = SaveCampaignBasicInformation;
