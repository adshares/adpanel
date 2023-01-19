import * as authActions from './auth.actions';
import { userInitialState } from 'models/initial-state/user';
import { GET_CURRENT_BALANCE_SUCCESS, GET_CURRENT_BALANCE_FAILURE, actions } from 'store/settings/settings.actions';

const initialState = userInitialState;

export function authReducers(state = initialState, action: authActions.actions | actions) {
  switch (action.type) {
    case authActions.SET_USER_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isAdserverWalletValid: true,
      };
    case authActions.UPDATE_USER_ADDRESS:
      return {
        ...state,
        adserverWallet: Object.assign({}, state.adserverWallet, {
          adsharesAddress: action.payload,
        }),
      };
    case authActions.UPDATE_USER_AUTOMATIC_WITHDRAW_PERIOD:
      return {
        ...state,
        adserverWallet: Object.assign({}, state.adserverWallet, {
          autoWithdrawPeriod: action.payload,
        }),
      };
    case authActions.UPDATE_USER_AUTOMATIC_WITHDRAW_AMOUNT:
      return {
        ...state,
        adserverWallet: Object.assign({}, state.adserverWallet, {
          autoWithdrawAmount: action.payload,
        }),
      };
    case GET_CURRENT_BALANCE_SUCCESS:
      return {
        ...state,
        exchangeRate: action.payload.exchangeRate,
        adserverWallet: action.payload.adserverWallet,
        isAdserverWalletValid: true,
        referralRefundEnabled: action.payload.referralRefundEnabled,
        referralRefundCommission: action.payload.referralRefundCommission,
        isEmailConfirmed: action.payload.isEmailConfirmed,
        isAdminConfirmed: action.payload.isAdminConfirmed,
        isConfirmed: action.payload.isConfirmed,
      };
    case GET_CURRENT_BALANCE_FAILURE:
      return {
        ...state,
        isAdserverWalletValid: false,
      };

    case authActions.USER_LOG_IN_SUCCESS:
      return initialState;

    case authActions.USER_LOG_OUT_SUCCESS:
    default:
      return state;
  }
}
