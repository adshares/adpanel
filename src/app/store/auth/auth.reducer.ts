import * as AuthAction from './auth.action';
import { userInitialState } from '../../models/initial-state/user.js';

const initialState = userInitialState;

export function authReducers(state = initialState , action: AuthAction.actions ) {
  switch (action.type) {
    case AuthAction.LOGIN_USER:
      return {
        ...state,
        auth: action.payload
      };
     default:
      return state;
  }
};
