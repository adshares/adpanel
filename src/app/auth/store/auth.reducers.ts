import * as AuthActions from './auth.actions';

import { UserModel } from './user.model';

const initialState = {
  userData: new UserModel('', true, false, false)
};

export function authReducers(state = initialState , action: AuthActions.AuthActions ) {
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
