import * as advertiserActions from './advertiser.actions';
import * as authActions from '../auth/auth.actions';
import {AdvertiserState} from 'models/app-state.model';
import {campaignInitialState, campaignsTotalsInitialState} from 'models/initial-state/campaign';

const initialState: AdvertiserState = {
  lastEditedCampaign: campaignInitialState,
  campaigns: [],
  campaignsTotals: campaignsTotalsInitialState
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
    case advertiserActions.LOAD_CAMPAIGN_SUCCESS:
      return {
        ...state,
        campaigns: [
          ...state.campaigns,
          {
            ...action.payload
          }
        ]
      };
    case advertiserActions.DELETE_CAMPAIGN_SUCCESS:
      const newCampaigns = state.campaigns.filter(el => el.id !== action.payload);
      return {
        ...state,
        campaigns: newCampaigns
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
      if (action.payload.data.length <= 0) {
        return {
          ...state,
          campaignsTotals: action.payload.total
        }
      }
      state.campaigns.map(campaign => {
        action.payload.data.forEach(data => {

          if (data.campaignId === campaign.id && !campaignsWithTotal.find(el => el.id === campaign.id)) {
            campaignsWithTotal.push({
              ...campaign,
              ...data
            })
          }
        });

        if (!campaignsWithTotal.find(el => el.id === campaign.id)) {
          campaignsWithTotal.push({...campaign})
        }
      });

      return {
        ...state,
        campaigns: campaignsWithTotal,
        campaignsTotals: action.payload.total
      };
    case advertiserActions.LOAD_CAMPAIGN_TOTALS_SUCCESS:
      const selectedCampaign = state.campaigns.find(el => el.id === action.payload.total.campaignId);
      const filteredCampaigns = state.campaigns.filter(el => el.id !== action.payload.total.campaignId);

      if (action.payload.data.length <= 0) {
        return {
          ...state,
          campaigns: [
            ...filteredCampaigns,
            {
              ...selectedCampaign,
              ...action.payload.total
            }
          ]
        };
      }

      const bannersData = [];
      if (selectedCampaign.ads !== undefined && selectedCampaign.ads.length > 0) {
        selectedCampaign.ads.forEach(add => {
          action.payload.data.forEach(element => {
            if (element.bannerId === add.id && !bannersData.find(el => el.id === add.id)) {
              bannersData.push({
                ...add,
                id: element.bannerId,
                averageCpc: element.averageCpc,
                clicks: element.clicks,
                cost: element.cost,
                ctr: element.ctr,
                impressions: element.impressions,

              })
            } else if (!bannersData.find(el => el.id === add.id)) {
              bannersData.push(add)
            }
          })
        });
      }

      return {
        ...state,
        campaigns: [...filteredCampaigns, {
          ...selectedCampaign,
          ...action.payload.total,
          ads: [...bannersData]
        }],
      };
    case authActions.USER_LOG_IN_SUCCESS:
    case authActions.USER_LOG_OUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
}
