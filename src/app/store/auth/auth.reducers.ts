import * as authActions from './auth.actions';
import { userInitialState } from 'models/initial-state/user.js';

const initialState = userInitialState;

export function authReducers(state = initialState , action: authActions.actions) {
  switch (action.type) {
    case authActions.SET_USER:
      return action.payload;
    case authActions.UPDATE_USER_ADDRESS:
      return {
        ...state,
        adserverWallet: Object.assign({}, state.adserverWallet, { adsharesAddress: action.payload })
      };
    case authActions.UPDATE_USER_AUTOMATIC_WITHDRAW_PERIOD:
      return {
        ...state,
        adserverWallet: Object.assign({}, state.adserverWallet, { autoWithdrawPeriod: action.payload })
      };
    case authActions.UPDATE_USER_AUTOMATIC_WITHDRAW_AMOUNT:
      return {
        ...state,
        adserverWallet: Object.assign({}, state.adserverWallet, { autoWithdrawAmount: action.payload })
      };
    default:
      return state;
  }
}
