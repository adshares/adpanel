import {
  LOAD_NOTIFICATIONS_SETTINGS_SUCCESS,
  UPDATE_NOTIFICATIONS_SETTINGS,
  GET_CURRENT_BALANCE_SUCCESS,
  GET_BILLING_HISTORY_SUCCESS,
  CANCEL_AWAITING_TRANSACTION_SUCCESS,
} from './settings.actions';
import { SettingsState } from 'models/app-state.model';
import { actions } from "store/admin/admin.actions";

const initialState: SettingsState = {
  notificationsSettings: [],
  wallet: {
    totalFunds: 0,
    bonusBalance: 0,
    lastPaymentAt: 0,
    totalFundsChange: 0,
    totalFundsInCurrency: 0,
    walletBalance: 0,
  },
  billingHistory: {
    limit: 10,
    offset: 0,
    itemsCount: 0,
    itemsCountAll: 0,
    items: []
  },
};

export function settingsReducers(state = initialState, action: actions) {
  switch (action.type) {
    case LOAD_NOTIFICATIONS_SETTINGS_SUCCESS:
      return {
        ...state,
        notificationsSettings: action.payload
      };
    case UPDATE_NOTIFICATIONS_SETTINGS:
      return {
        ...state,
        notificationsSettings: action.payload
      };

    case GET_CURRENT_BALANCE_SUCCESS:
      return {
        ...state,
        wallet: action.payload
      };
    case GET_BILLING_HISTORY_SUCCESS:
      return {
        ...state,
        billingHistory: action.payload
      };
    case CANCEL_AWAITING_TRANSACTION_SUCCESS:
      const items = state.billingHistory.items.filter(el => el.id !== action.payload);
      return {
        ...state,
        billingHistory: {
          ...state.billingHistory,
          items,
        }
      };
    default:
      return state;
  }
}
