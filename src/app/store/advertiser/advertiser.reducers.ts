import * as advertiserActions from './advertiser.actions';
import * as authActions from '../auth/auth.actions';
import {AdvertiserState} from 'models/app-state.model';
import {campaignInitialState, campaignsTotalsInitialState} from 'models/initial-state/campaign';
import {a} from "@angular/core/src/render3";

const initialState: AdvertiserState = {
  lastEditedCampaign: campaignInitialState,
  campaigns: [],
  campaignsTotals: [campaignsTotalsInitialState]
};

export function advertiserReducers(state = initialState, action: advertiserActions.actions | authActions.actions) {
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

    case advertiserActions.UPDATE_CAMPAIGN_SUCCESS:
      const campaigns = state.campaigns.filter(campaign => {
        return campaign.id !== action.payload.id
      });
      return {
        ...state,
        campaigns: [...campaigns, action.payload]
      };
    case advertiserActions.LOAD_CAMPAIGNS_SUCCESS:
      return {
        ...state,
        campaigns: action.payload
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
    case advertiserActions.LOAD_CAMPAIGNS_TOTALS_SUCCESS:
      const campaignsWithTotal = [];
      state.campaigns.forEach(campaign => {
        action.payload.data.forEach(data => {
          if (campaignsWithTotal.find(el => el.id === campaign.id)) {
            if (data.campaignId === campaign.id) {
              campaignsWithTotal.push({
                ...campaign,
                ...data
              })
            } else {
              campaignsWithTotal.push({
                ...campaign,
                ...data
              })
            }
          }

        })
      });
      console.log('asd', action.payload.data)
      console.log('asd', campaignsWithTotal)
      return {
        ...state,
        campaigns: campaignsWithTotal,
        campaignsTotals: action.payload.total
      };
    case advertiserActions.LOAD_CAMPAIGN_BANNER_DATA_SUCCESS:
      if (action.payload.length <= 0) return state;
      const campaign = state.campaigns.find(campaign => campaign.id === action.payload.data.campaignId);
      const newCampaigns = state.campaigns.filter(campaign => campaign.id !== action.payload.data.campaignId);
      const bannersData = [];

      if (!!campaign && typeof  campaign.ads !== 'undefined' && campaign.ads.length > 0) {
        campaign.ads.forEach(add => {
          action.payload.data.forEach(element => {
            if (element.bannerId === add.id) {
              bannersData.push({
                ...add,
                id: element.bannerId,
                averageCpc: element.averageCpc,
                clicks: element.clicks,
                cost: element.cost,
                ctr: element.ctr,
                impressions: element.impressions,
              })
            }
          })
        });
      }
      return {
        ...state,
        campaigns: [...newCampaigns, {...campaign, ads: [...bannersData]}],
        campaignsTotals: action.payload.total
      };

    case authActions.USER_LOG_IN_SUCCESS:
    case authActions.USER_LOG_OUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
}
