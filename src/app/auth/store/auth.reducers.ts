import * as AuthActions from './auth.actions';

import { UserModel } from './user.model';

const initialState: {[key: string]: UserModel} = {
  userData: {
    email: '',
    isAdvertiser: true,
    isPublisher: true,
    isAdmin: false
  }
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
