import { Action } from '@ngrx/store';

import * as AuthActions from './auth.actions';

const initialState = {
  userData: {
    email: '',
    isAdvertiser: false,
    isPublisher: false
  }
}

export function authReducers(state = initialState , action: AuthActions.AuthActions ) {
  switch (action.type) {
    case AuthActions.LOGIN_USER:
      return {
        ...state,
        userData: [...state.userData, action.payload]
      }
     default:
       return state;
  }
}
