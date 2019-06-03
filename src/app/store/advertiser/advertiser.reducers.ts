import * as advertiserActions from './advertiser.actions';
import * as authActions from '../auth/auth.actions';
import { AdvertiserState } from 'models/app-state.model';
import {
  campaignInitialState,
  campaignsTotalsInitialState
} from 'models/initial-state/campaign';

const initialState: AdvertiserState = {
  lastEditedCampaign: campaignInitialState,
  campaigns: [],
  campaignsTotals: campaignsTotalsInitialState
};

const bannerStatsInitialState = {
  clicks: 0,
  impressions: 0,
  ctr: 0,
  averageCpm: 0,
  averageCpc: 0,
  cost: 0,
};

/** FIXME -> PAN-364 -> refactor reducer by creating class containing needed helper function and data
 * set to help modify data in less repetitive more readable way
 */

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
    case advertiserActions.UPDATE_CAMPAIGN_STATUS_SUCCESS:
      const mappedCampaigns = state.campaigns.map(campaign => {
        return campaign.id !== action.payload.id ? campaign : {
          ...campaign,
          basicInformation: {
            ...campaign.basicInformation,
            status: action.payload.status
          }
        }
      });

      return {
        ...state,
        campaigns: mappedCampaigns
      };
    case advertiserActions.LOAD_CAMPAIGNS_SUCCESS:
      return {
        ...state,
        campaigns: action.payload
      };
    case advertiserActions.LOAD_CAMPAIGN_SUCCESS:
      const campaign = state.campaigns.filter(campaign => campaign.id !== action.payload.id);

      return {
        ...state,
        campaigns: [
          ...campaign,
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
        lastEditedCampaign: {...state.lastEditedCampaign, targetingArray: action.payload}
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

      if (action.payload.data.length > 0 && selectedCampaign.ads !== undefined && selectedCampaign.ads.length > 0) {
        const reducedUnits = [selectedCampaign.ads, action.payload.data].reduce((banners, data) => banners.map((banner) => {
            const elementWithStats = data.find(el => el.id === banner.id);
            return elementWithStats ? {
              ...banner,
              ...elementWithStats,
            } : banner;
          })
        );
        return {
          ...state,
          campaigns: [...filteredCampaigns, {
            ...selectedCampaign,
            ...action.payload.total,
            ads: reducedUnits,
          }],
        };
      }

      const resetBannerStats = selectedCampaign.ads.map(el => {
        return {
          ...el,
          ...bannerStatsInitialState
        }
      });
      return {
        ...state,
        campaigns: [
          ...filteredCampaigns,
          {
            ...selectedCampaign,
            ads: resetBannerStats,
            ...action.payload.total
          }
        ]
      };

    case authActions.USER_LOG_IN_SUCCESS:
      return initialState;

    case authActions.USER_LOG_OUT_SUCCESS:
    default:
      return state;
  }
}
