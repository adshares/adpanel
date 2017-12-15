import * as AuthAction from './auth.action';

import { User } from '../../models/user.model';
import { AuthState } from '../../models/auth-state.model';

const initialState: AuthState = {
  userData: {} as User
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
