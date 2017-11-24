import * as AuthActions from './auth.actions';

import { UserModel } from './user.model';

const initialState = {
  userData: new UserModel('user@o2.pl', false, false)
}

export function authReducers(state = initialState , action: AuthActions.AuthActions ) {
  switch (action.type) {
    case AuthActions.LOGIN_USER:
      return {
        ...state,
        userData: [state.userData, action.payload]
      }
     default:
       return state;
  }
}
