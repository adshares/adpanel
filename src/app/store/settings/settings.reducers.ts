import * as settingsActions from './settings.actions';
import {SettingsState} from 'models/app-state.model';

const initialState: SettingsState = {
  notificationsSettings: [],
  totalFunds: 0
};

export function settingsReducers(state = initialState, action: settingsActions.actions) {
  switch (action.type) {
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

    case settingsActions.GET_CURRENT_BALANCE_SUCCESS:
      return {
        ...state,
        totalFunds: action.payload
      };
    default:
      return state;
  }
}
