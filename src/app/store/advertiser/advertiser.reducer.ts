import * as AdvertiserActions from './advertiser.action';
import { AdvertiserState } from '../../models/advertiser-state.model';
import { Campaign } from '../../models/campaign.model';
import { campaignInitialState } from '../../models/initial-state/campaign';

const initialState: AdvertiserState = {
  lastEditedCampaign: campaignInitialState,
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
    case AdvertiserActions.SAVE_CAMPAING_TARGETING:
      return {
        ...state,
        lastEditedCampaign: Object.assign({}, state.lastEditedCampaign, { targeting: action.payload })
      }
    case AdvertiserActions.SAVE_CAMPAING_ADS:
      return {
        ...state,
        lastEditedCampaign: Object.assign({}, state.lastEditedCampaign, { ads: action.payload })
      }
    default:
      return state;
  }
}
