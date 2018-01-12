import * as SettingsActions from './settings.actions';
import { SettingsState } from '../../models/settings-state.model';

const initialState: SettingsState = {
  billingHistory: [],
  notificationsSettings: []
};

export function settingsReducers(state = initialState, action: SettingsActions.actions) {
  switch (action.type) {
    case SettingsActions.LOAD_BILLING_HISTORY_SUCCESS:
      return {
        ...state,
        billingHistory: action.payload
      };
    case SettingsActions.LOAD_NOTIFICATIONS_SETTINGS_SUCCESS:
      return {
        ...state,
        notificationsSettings: action.payload
      };
    default:
      return state;
  }
}
