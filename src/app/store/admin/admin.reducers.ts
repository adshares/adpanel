import {
  LOAD_USERS_SUCCESS,
  LOAD_ADMIN_SETTINGS_SUCCESS,
  SET_ADMIN_SETTINGS_SUCCESS,
  actions
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
    publisherCommission : 0,
    advertiserCommission : 0,
    hotwalletIsActive: 0,
  }
};

export function adminReducers(state=initialState, action: actions) {
  switch (action.type) {
    case LOAD_USERS_SUCCESS:
      return {
        ...state,
        ...action.payload
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
    default:
      return state;
  }
}
