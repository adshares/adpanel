import * as adminActions from './admin.actions';
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
    ishotwalletactive: 0,
  }
};

export function adminReducers(state=initialState, action: adminActions.actions) {
  switch (action.type) {
    case adminActions.LOAD_USERS_SUCCESS:
      return {
        ...state,
        ...action.payload
      };
    case adminActions.LOAD_ADMIN_SETTINGS_SUCCESS:
      return {
        ...state,
        settings: action.payload
      };
    case adminActions.SET_ADMIN_SETTINGS:
      return {
        ...state,
        settings: action.payload
      };
    default:
      return state;
  }
}
