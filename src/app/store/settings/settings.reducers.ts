import * as settingsActions from './settings.actions';
import { SettingsState } from 'models/app-state.model';

const initialState: SettingsState = {
  billingHistory: [],
  notificationsSettings: []
};

export function settingsReducers(state = initialState, action: settingsActions.actions) {
  switch (action.type) {
    case settingsActions.LOAD_BILLING_HISTORY_SUCCESS:
      return {
        ...state,
        billingHistory: action.payload
      };
    case settingsActions.LOAD_NOTIFICATIONS_SETTINGS_SUCCESS:
      return {
        ...state,
        notificationsSettings: action.payload
      };
    case settingsActions.UPDATE_NOTIFICATIONS_SETTINGS:
      return {
        ...state,
        notificationsSettings: action.payload
      };
    default:
      return state;
  }
}
