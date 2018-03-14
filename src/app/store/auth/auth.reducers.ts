import * as authActions from './auth.actions';
import { userInitialState } from 'models/initial-state/user.js';

const initialState = userInitialState;

export function authReducers(state = initialState , action: authActions.actions) {
  switch (action.type) {
    case authActions.SET_USER:
      return action.payload;
    default:
      return state;
  }
}
