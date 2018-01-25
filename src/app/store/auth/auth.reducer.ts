import * as AuthAction from './auth.action';
import { userInitialState } from '../../models/initial-state/user.js';

const initialState = userInitialState

export function authReducers(state = initialState , action: AuthAction.actions ) {
  switch (action.type) {
    case AuthAction.LOGIN_USER:
      return {
        ...state,
        auth: action.payload
      };
    case AuthAction.SET_ACTIVE_USER_TYPE:
      return {
        ...state,
        activeUserType: action.payload
      };
     default:
      return state;
  }
};
