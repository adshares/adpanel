import * as authActions from './auth.actions';
import { userInitialState } from 'models/initial-state/user.js';

const initialState = userInitialState;

export function authReducers(state = initialState , action: authActions.actions) {
  switch (action.type) {
    case authActions.SET_USER:
      return action.payload;
    case authActions.UPDATE_USER_ETH_ADDRESS:
      return {
        ...state,
        financialData: Object.assign({}, state.financialData, { userEthAddress: action.payload })
      };
    case authActions.UPDATE_USER_AUTOMATIC_WITHDRAW_PERIOD:
      return {
        ...state,
        financialData: Object.assign({}, state.financialData, { userAutomaticWithdrawPeriod: action.payload })
      };
    case authActions.UPDATE_USER_AUTOMATIC_WITHDRAW_AMOUNT:
      return {
        ...state,
        financialData: Object.assign({}, state.financialData, { userAutomaticWithdrawAmount: action.payload })
      };
    default:
      return state;
  }
}
