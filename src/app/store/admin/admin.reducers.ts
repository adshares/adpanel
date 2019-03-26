import {
  actions,
  LOAD_USERS_SUCCESS,
  LOAD_ADMIN_SETTINGS_SUCCESS,
  SET_ADMIN_SETTINGS_SUCCESS,
  GET_PRIVACY_SETTINGS_SUCCESS,
  GET_TERMS_SETTINGS_SUCCESS,
  GET_LICENSE_SUCCESS,
  GET_LICENSE_FAILURE,
} from './admin.actions';
import { AdminState } from 'models/app-state.model';

const initialState: AdminState = {
  users: [],
  settings: {
    adserverName: '',
    hotwalletAddress: '',
    hotwalletMaxValue: 0,
    hotwalletMinValue: 0,
    supportEmail: '',
    technicalEmail: '',
    publisherCommission: 0,
    advertiserCommission: 0,
    hotwalletIsActive: 0,
  },
  termsAndPrivacy: {
    privacy: '',
    terms: '',
  },
  license: null,
  panelBlockade: false,
};

export function adminReducers(state = initialState, action: actions) {
  switch (action.type) {
    case LOAD_USERS_SUCCESS:
      return {
        ...state,
        ...action.payload
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
        license: action.payload
      };

    case GET_LICENSE_FAILURE:
      return {
        ...state,
        license: null
      };
    case LOAD_ADMIN_SETTINGS_SUCCESS:
      return {
        ...state,
        settings: action.payload.settings
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
    default:
      return state;
  }
}
