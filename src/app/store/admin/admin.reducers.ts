import {
  actions,
  GET_LICENSE_FAILURE,
  GET_LICENSE_SUCCESS,
  LOAD_ADMIN_SETTINGS_SUCCESS,
  LOAD_ADVERTISERS_SUCCESS,
  LOAD_PUBLISHERS_SUCCESS,
  LOAD_USERS_SUCCESS,
} from './admin.actions';
import { AdminState } from 'models/app-state.model';

const initialState: AdminState = {
  users: null,
  advertisers: null,
  publishers: null,
  settings: {
    adUserInfoUrl: '',
  },
  license: null,
  panelBlockade: false,
};

export function adminReducers(state = initialState, action: actions) {
  switch (action.type) {
    case LOAD_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
      };
    case LOAD_ADVERTISERS_SUCCESS:
      return {
        ...state,
        advertisers: action.payload,
      };
    case LOAD_PUBLISHERS_SUCCESS:
      return {
        ...state,
        publishers: action.payload,
      };
    case GET_LICENSE_SUCCESS:
      if (action.payload.status !== 1) {
        return {
          ...state,
          license: action.payload,
          panelBlockade: true,
        };
      }
      return {
        ...state,
        license: action.payload,
        panelBlockade: false,
      };

    case GET_LICENSE_FAILURE:
      return {
        ...state,
        license: null,
        panelBlockade: false,
      };
    case LOAD_ADMIN_SETTINGS_SUCCESS:
      return {
        ...state,
        settings: action.payload.settings,
      };

    default:
      return state;
  }
}
