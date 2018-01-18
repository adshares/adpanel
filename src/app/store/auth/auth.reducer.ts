import * as AuthAction from './auth.action';

import { User } from '../../models/user.model';
import { AuthState } from '../../models/app-state.model';
import { userInitialState } from '../../models/initial-state/user.js';

const initialState: AuthState = {
  userData: userInitialState
};

export function authReducers(state = initialState , action: AuthAction.actions ): AuthState {
  switch (action.type) {
    case AuthAction.LOGIN_USER:
      return {
        ...state,
        userData: action.payload
      }
     default:
      return state;
  }
};
