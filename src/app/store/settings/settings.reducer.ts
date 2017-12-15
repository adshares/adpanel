import * as SettingsActions from './settings.actions';

const initialState: any = {
  billingHistory: [],
  notificationsSettings: []
};

export function settingsReducer(state = initialState, action: SettingsActions.actions) {
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
