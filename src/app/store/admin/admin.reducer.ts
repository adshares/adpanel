import * as AdminActions from './admin.action';
import { AdminState } from '../../models/app-state.model';

const initialState: AdminState = {
  users: [],
  settings: {
    earnings: 0
  }
};

export function adminReducers(state = initialState, action: AdminActions.actions) {
  switch (action.type) {
    case AdminActions.LOAD_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload
      }
    case AdminActions.LOAD_ADMIN_SETTINGS_SUCCESS:
      return {
        ...state,
        settings: action.payload
      }
    default:
      return state;
  }
}
