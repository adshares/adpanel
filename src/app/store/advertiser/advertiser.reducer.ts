import * as AdvertiserActions from './advertiser.action';

const initialState: any = {
  lastEditedCampaign: {}
}

export function advertiserReducers(state = initialState, action: AdvertiserActions.actions) {
  switch (action.type) {
    case AdvertiserActions.SAVE_CAMPAIGN_BASIC_INFORMATION:
      return {
        ...state,
        lastEditedCampaign: action.payload
      }
    default:
      return state;
  }
}
