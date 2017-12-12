import * as AdvertiserActions from './advertiser.action';

const initialState: any = {
  lastEditedCampaign: {},
  campaigns: []
};

export function advertiserReducers(state = initialState, action: AdvertiserActions.actions) {
  switch (action.type) {
    case AdvertiserActions.SAVE_CAMPAIGN_BASIC_INFORMATION:
      return {
        ...state,
        lastEditedCampaign: action.payload
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
