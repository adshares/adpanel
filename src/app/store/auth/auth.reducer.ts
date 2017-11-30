import * as AuthActions from './auth.action';

import { UserModel } from '../../model/user.model';

interface AuthState {
  userData: {
    email: string;
    isAdvertiser: boolean;
    isPublisher: boolean;
    isAdmin: boolean;
  }
}

const initialState: AuthState = {
  userData: {
    email: '',
    isAdvertiser: true,
    isPublisher: true,
    isAdmin: false
  }
};

function authReducers(state = initialState , action: AuthActions.actions ): AuthState {
  switch (action.type) {
    case AuthActions.LOGIN_USER:
      return {
        ...state,
        userData: action.payload
      }
     default:
      return state;
  }
}

export {authReducers, AuthState};
