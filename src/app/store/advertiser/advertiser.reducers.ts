import * as advertiserActions from './advertiser.actions';
import {AdvertiserState} from 'models/app-state.model';
import {campaignInitialState, campaignsTotalsInitialState} from 'models/initial-state/campaign';
import {formatMoney} from "common/utilities/helpers";

const initialState: AdvertiserState = {
  lastEditedCampaign: campaignInitialState,
  campaigns: [],
  campaignsTotals: [campaignsTotalsInitialState]
};

export function advertiserReducers(state = initialState, action: advertiserActions.actions) {
  switch (action.type) {
    case advertiserActions.CLEAR_LAST_EDITED_CAMPAIGN:
      return {
        ...state,
        lastEditedCampaign: Object.assign({}, state.lastEditedCampaign, campaignInitialState)
      };
    case advertiserActions.SET_LAST_EDITED_CAMPAIGN:
      return {
        ...state,
        lastEditedCampaign: Object.assign({}, action.payload)
      };
    case advertiserActions.SAVE_CAMPAIGN_BASIC_INFORMATION:
      return {
        ...state,
        lastEditedCampaign: Object.assign({}, state.lastEditedCampaign, {basicInformation: action.payload})
      };
    case advertiserActions.LOAD_CAMPAIGNS_SUCCESS:
      return {
        ...state,
        campaigns: action.payload
      };
    case advertiserActions.LOAD_CAMPAIGNS_TOTALS_SUCCESS:
      return {
        ...state,
        campaignsTotals: action.payload
      };
    case advertiserActions.SAVE_CAMPAIGN_TARGETING:
      return {
        ...state,
        lastEditedCampaign: Object.assign({}, state.lastEditedCampaign, {targetingArray: action.payload})
      };
    case advertiserActions.SAVE_CAMPAIGN_ADS:
      return {
        ...state,
        lastEditedCampaign: Object.assign({}, state.lastEditedCampaign, {ads: action.payload})
      };
    case advertiserActions.ADD_CAMPAIGN_TO_CAMPAIGNS_SUCCESS:
      return {
        ...state,
        campaigns: [...state.campaigns, action.payload]
      };
    case advertiserActions.LOAD_CAMPAIGN_BANNER_DATA_SUCCESS:

      const campaign = state.campaigns.find(campaign => campaign.id === action.payload[0].campaignId);
      const newCampaigns = state.campaigns.filter(campaign => campaign.id !== action.payload[0].campaignId);
      const bannersData = [];

      campaign.ads.forEach(add => {
        action.payload.forEach(element => {
          if (element.bannerId === add.id) {
            bannersData.push({
              ...add,
              id: element.bannerId,
              averageCpc: formatMoney(element.averageCpc, 3, true, '.', ''),
              clicks: element.clicks,
              cost: formatMoney(element.cost, 3, true, '.', ''),
              ctr: element.ctr,
              impressions: element.impressions,

            })
          }
        })
      });
      return {
        ...state,
        campaigns: [...newCampaigns, {...campaign, ads: [...bannersData]}]
      };
    default:
      return state;
  }
}
