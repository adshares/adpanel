import * as AdvertiserActions from './advertiser.actions';
import * as AuthActions from '../auth/auth.actions';
import { AdvertiserState } from 'models/app-state.model';
import {
  campaignInitialState,
  campaignsConfigInitialState,
  campaignsTotalsInitialState,
} from 'models/initial-state/campaign';
import { campaignStatusesEnum } from 'models/enum/campaign.enum';

const initialState: AdvertiserState = {
  lastEditedCampaign: campaignInitialState,
  campaigns: [],
  campaignsLoaded: false,
  campaignsTotals: campaignsTotalsInitialState,
  dataLoaded: false,
  campaignsConfig: campaignsConfigInitialState,
};

const bannerStatsInitialState = {
  clicks: 0,
  impressions: 0,
  ctr: 0,
  averageCpm: 0,
  averageCpc: 0,
  cost: 0,
};

export function advertiserReducers(state = initialState, action: AdvertiserActions.actions | AuthActions.actions) {
  switch (action.type) {
    case AdvertiserActions.CLEAR_LAST_EDITED_CAMPAIGN:
      return {
        ...state,
        lastEditedCampaign: Object.assign({}, state.lastEditedCampaign, campaignInitialState),
      };
    case AdvertiserActions.SET_LAST_EDITED_CAMPAIGN:
      return {
        ...state,
        lastEditedCampaign: Object.assign({}, action.payload),
      };
    case AdvertiserActions.SAVE_CAMPAIGN_BASIC_INFORMATION:
      return {
        ...state,
        lastEditedCampaign: Object.assign({}, state.lastEditedCampaign, {
          basicInformation: action.payload,
        }),
      };
    case AdvertiserActions.UPDATE_CAMPAIGN_SUCCESS:
      const campaigns = state.campaigns.filter(campaign => {
        return campaign.id !== action.payload.id;
      });
      return {
        ...state,
        campaigns: [...campaigns, action.payload],
      };
    case AdvertiserActions.UPDATE_CAMPAIGN_STATUS_SUCCESS:
      const mappedCampaigns = state.campaigns.map(campaign => {
        return campaign.id !== action.payload.id
          ? campaign
          : {
              ...campaign,
              basicInformation: {
                ...campaign.basicInformation,
                status: action.payload.status,
              },
            };
      });

      return {
        ...state,
        campaigns: mappedCampaigns,
      };
    case AdvertiserActions.ACTIVATE_OUTDATED_CAMPAIGN_SUCCESS:
      return {
        ...state,
        campaigns: state.campaigns.map(campaign => {
          return campaign.id !== action.payload.campaignId
            ? campaign
            : {
                ...campaign,
                basicInformation: {
                  ...campaign.basicInformation,
                  status: campaignStatusesEnum.ACTIVE,
                  dateEnd: null,
                },
              };
        }),
      };
    case AdvertiserActions.LOAD_CAMPAIGNS:
      return {
        ...state,
        dataLoaded: false,
        campaignsLoaded: false,
      };
    case AdvertiserActions.LOAD_CAMPAIGNS_SUCCESS:
      return {
        ...state,
        campaigns: action.payload,
        campaignsLoaded: true,
      };
    case AdvertiserActions.LOAD_CAMPAIGN:
      return {
        ...state,
        dataLoaded: false,
      };
    case AdvertiserActions.LOAD_CAMPAIGN_SUCCESS: {
      const _campaigns = [...state.campaigns];
      const i = _campaigns.findIndex(campaign => campaign.id === action.payload.id);
      if (-1 !== i) {
        _campaigns[i] = action.payload;
      } else {
        _campaigns.push(action.payload);
      }

      return {
        ...state,
        campaigns: _campaigns,
      };
    }
    case AdvertiserActions.DELETE_CAMPAIGN_SUCCESS:
      const newCampaigns = state.campaigns.filter(el => el.id !== action.payload);
      return {
        ...state,
        campaigns: newCampaigns,
      };
    case AdvertiserActions.SAVE_CAMPAIGN_TARGETING:
      return {
        ...state,
        lastEditedCampaign: {
          ...state.lastEditedCampaign,
          targetingArray: action.payload,
        },
      };
    case AdvertiserActions.SAVE_CAMPAIGN_ADS:
      return {
        ...state,
        lastEditedCampaign: Object.assign({}, state.lastEditedCampaign, {
          ads: action.payload,
        }),
      };
    case AdvertiserActions.ADD_CAMPAIGN_TO_CAMPAIGNS_SUCCESS:
      return {
        ...state,
        campaigns: [...state.campaigns, action.payload],
      };

    case AdvertiserActions.LOAD_CAMPAIGNS_TOTALS_SUCCESS:
      const campaignsWithTotal = [];
      if (action.payload.data.length <= 0) {
        return {
          ...state,
          dataLoaded: true,
          campaignsTotals: action.payload.total,
        };
      }
      state.campaigns.forEach(campaign => {
        action.payload.data.forEach(data => {
          if (data.campaignId === campaign.id && !campaignsWithTotal.find(el => el.id === campaign.id)) {
            campaignsWithTotal.push({
              ...campaign,
              ...data,
            });
          }
        });
        if (!campaignsWithTotal.find(el => el.id === campaign.id)) {
          campaignsWithTotal.push({ ...campaign });
        }
      });
      return {
        ...state,
        dataLoaded: true,
        campaigns: campaignsWithTotal,
        campaignsTotals: action.payload.total,
      };
    case AdvertiserActions.LOAD_CAMPAIGN_TOTALS_SUCCESS: {
      const _campaigns = [...state.campaigns];
      const i = _campaigns.findIndex(el => el.id === action.payload.total.campaignId);

      let bannerStats = [];
      if (action.payload.data.length > 0 && _campaigns[i].ads !== undefined && _campaigns[i].ads.length > 0) {
        bannerStats = [_campaigns[i].ads, action.payload.data].reduce((banners, data) =>
          banners.map(banner => {
            const elementWithStats = data.find(el => el.id === banner.id);
            return elementWithStats
              ? {
                  ...banner,
                  ...elementWithStats,
                }
              : banner;
          })
        );
      } else {
        bannerStats = _campaigns[i].ads.map(el => {
          return {
            ...el,
            ...bannerStatsInitialState,
          };
        });
      }

      _campaigns[i] = {
        ..._campaigns[i],
        ...action.payload.total,
        ads: bannerStats,
      };

      return {
        ...state,
        dataLoaded: true,
        campaigns: _campaigns,
      };
    }
    case AdvertiserActions.LOAD_CAMPAIGNS_CONFIG_SUCCESS:
      return {
        ...state,
        campaignsConfig: action.payload,
      };
    case AuthActions.USER_LOG_IN_SUCCESS:
      return initialState;

    case AuthActions.USER_LOG_OUT_SUCCESS:
    default:
      return state;
  }
}
