import { Action } from '@ngrx/store';
import { Campaign, CampaignBasicInformation, CampaignTargeting, Ad } from '../../models/campaign.model';

export const LOAD_USERS = 'Users loaded';
export const LOAD_USERS_SUCCESS = 'Users loaded success';

export class LoadUsers implements Action {
  readonly type: string = LOAD_USERS;
  constructor(public payload: any) { };
}

export class LoadUsersSuccess implements Action {
  readonly type: string = LOAD_USERS_SUCCESS;
  constructor(public payload: any) { };
}

export type actions =
  LoadUsers |
  LoadUsersSuccess;
