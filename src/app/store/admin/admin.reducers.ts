import {
  actions,
  GET_INDEX_FAILURE,
  GET_INDEX_SUCCESS,
  GET_LICENSE_FAILURE,
  GET_LICENSE_SUCCESS,
  GET_PRIVACY_SETTINGS_SUCCESS,
  GET_REJECTED_DOMAINS_SUCCESS,
  GET_TERMS_SETTINGS_SUCCESS,
  LOAD_ADMIN_SETTINGS_SUCCESS,
  LOAD_ADMIN_WALLET_SUCCESS,
  LOAD_ADVERTISERS_SUCCESS,
  LOAD_PUBLISHERS_SUCCESS,
  LOAD_USERS_SUCCESS,
  SET_ADMIN_SETTINGS_SUCCESS,
} from './admin.actions';
import { AdminState } from 'models/app-state.model';

const initialState: AdminState = {
  users: null,
  advertisers: null,
  publishers: null,
  settings: {
    adserverName: '',
    coldWalletAddress: '',
    hotwalletMaxValue: 0,
    hotwalletMinValue: 0,
    supportEmail: '',
    technicalEmail: '',
    publisherCommission: 0,
    advertiserCommission: 0,
    coldWalletIsActive: 0,
    registrationMode: 'public',
  },
  wallet: {
    balance: 0,
    unusedBonuses: 0,
  },
  termsAndPrivacy: {
    privacy: '',
    terms: '',
  },
  rejectedDomains: [],
  license: null,
  index: null,
  panelBlockade: false,
};

export function adminReducers(state = initialState, action: actions) {
  switch (action.type) {
    case LOAD_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload
      };
    case LOAD_ADVERTISERS_SUCCESS:
      return {
        ...state,
        advertisers: action.payload
      };
    case LOAD_PUBLISHERS_SUCCESS:
      return {
        ...state,
        publishers: action.payload
      };
    case GET_LICENSE_SUCCESS:
      if (action.payload.status !== 1) {
        return {
          ...state,
          license: action.payload,
          panelBlockade: true
        };
      }
      return {
        ...state,
        license: action.payload,
        panelBlockade: false
      };

    case GET_LICENSE_FAILURE:
      return {
        ...state,
        license: null,
        panelBlockade: false
      };
    case LOAD_ADMIN_SETTINGS_SUCCESS:
      return {
        ...state,
        settings: action.payload.settings
      };
    case LOAD_ADMIN_WALLET_SUCCESS:
      return {
        ...state,
        wallet: action.payload.wallet,
      };
    case SET_ADMIN_SETTINGS_SUCCESS:
      return {
        ...state,
        settings: action.payload
      };
    case GET_PRIVACY_SETTINGS_SUCCESS:
      return {
        ...state,
        termsAndPrivacy: {
          ...state.termsAndPrivacy,
          privacy: action.payload.content
        }
      };
    case GET_TERMS_SETTINGS_SUCCESS:
      return {
        ...state,
        termsAndPrivacy: {
          ...state.termsAndPrivacy,
          terms: action.payload.content
        }
      };
    case GET_REJECTED_DOMAINS_SUCCESS:
      return {
        ...state,
        rejectedDomains: action.payload.domains,
      };
    case GET_INDEX_SUCCESS:
      return {
        ...state,
        index: {
          updateTime: action.payload.indexUpdateTime,
          error: false,
        }
      };
    case GET_INDEX_FAILURE:
      const updateTime = (!state.index) ? '' : state.index.updateTime;

      return {
        ...state,
        index: {
          updateTime,
          error: true,
        }
      };
    default:
      return state;
  }
}
