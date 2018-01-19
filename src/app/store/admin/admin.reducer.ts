import * as AdminActions from './admin.action';
import { UsersInfoStatsState } from '../../models/app-state.model';

const initialState: UsersInfoStatsState = {
  users: []
};

export function adminReducers(state = initialState, action: AdminActions.actions) {
  switch (action.type) {
    case AdminActions.LOAD_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload
      }
    default:
      return state;
  }
}
