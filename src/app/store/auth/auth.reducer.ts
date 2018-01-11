import * as AuthAction from './auth.action';
import { AuthState } from '../../models/auth-state.model';

const initialState: AuthState = {
  data: {
    email: '',
    isAdvertiser: true,
    isPublisher: true,
    isAdmin: false
  }
};

export function authReducers(state = initialState , action: AuthAction.actions ): AuthState {
  switch (action.type) {
    case AuthAction.LOGIN_USER:
      return {
        ...state,
        data: action.payload
      }
     default:
      return state;
  }
};
