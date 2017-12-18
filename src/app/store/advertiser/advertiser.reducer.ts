import * as AdvertiserActions from './advertiser.action';
import { AdvertiserState } from '../../models/advertiser-state.model';
import { Campaign } from '../../models/campaign.model';

const initialState: AdvertiserState = {
  lastEditedCampaign: {} as Campaign,
  campaigns: []
};

export function advertiserReducers(state = initialState, action: AdvertiserActions.actions) {
  switch (action.type) {
    case AdvertiserActions.SAVE_CAMPAIGN_BASIC_INFORMATION:
      return {
        ...state,
        lastEditedCampaign: { basicInformation: action.payload }
      };
    case AdvertiserActions.LOAD_CAMPAIGNS_SUCCESS:
      return {
        ...state,
        campaigns: action.payload
      };
    default:
      return state;
  }
}
