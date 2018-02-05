import * as AdvertiserActions from './advertiser.action';
import { AdvertiserState } from '../../models/app-state.model';
import { Campaign } from '../../models/campaign.model';
import { campaignInitialState } from '../../models/initial-state/campaign';

const initialState: AdvertiserState = {
  lastEditedCampaign: campaignInitialState,
  campaigns: []
};

export function advertiserReducers(state = initialState, action: AdvertiserActions.actions) {
  switch (action.type) {
    case AdvertiserActions.CLEAR_LAST_EDITED_CAMPAIGN:
      return {
        ...state,
        lastEditedCampaign: Object.assign({}, state.lastEditedCampaign, campaignInitialState)
      }
    case AdvertiserActions.SET_LAST_EDITED_CAMPAIGN:
      return {
        ...state,
        lastEditedCampaign: Object.assign({}, action.payload)
      }
    case AdvertiserActions.SAVE_CAMPAIGN_BASIC_INFORMATION:
      return {
        ...state,
        lastEditedCampaign: Object.assign({}, state.lastEditedCampaign, { basicInformation: action.payload })
      };
    case AdvertiserActions.LOAD_CAMPAIGNS_SUCCESS:
      return {
        ...state,
        campaigns: action.payload
      };
    case AdvertiserActions.SAVE_CAMPAIGN_TARGETING:
      return {
        ...state,
        lastEditedCampaign: Object.assign({}, state.lastEditedCampaign, { targetingArray: action.payload })
      }
    case AdvertiserActions.SAVE_CAMPAIGN_ADS:
      return {
        ...state,
        lastEditedCampaign: Object.assign({}, state.lastEditedCampaign, { ads: action.payload })
      }
    case AdvertiserActions.ADD_CAMPAIGN_TO_CAMPAIGNS:
      return {
        ...state,
        campaigns: [...state.campaigns, action.payload]
      }
    default:
      return state;
  }
}
