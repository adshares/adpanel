import * as SettingsActions from './settings.actions';

const initialState: any = {
  billingHistory: []
};

export function settingsReducer(state = initialState, action: SettingsActions.actions) {
  switch (action.type) {
    case SettingsActions.LOAD_BILLING_HISTORY_SUCCESS:
      return {
        ...state,
        billingHistory: action.payload
      };
    default:
      return state;
  }
}
