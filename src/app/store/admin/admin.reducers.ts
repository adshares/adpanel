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
    hotwalletIsActive: 0,
  }
};

export function adminReducers(state = initialState, action: adminActions.actions) {
  switch (action.type) {
    case adminActions.LOAD_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload
      };
    case adminActions.LOAD_ADMIN_SETTINGS_SUCCESS:
      return {
        ...state,
        ...action.payload
      };
    case adminActions.SET_ADMIN_SETTINGS_SUCCESS:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
