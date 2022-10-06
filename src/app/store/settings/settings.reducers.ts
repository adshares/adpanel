import { DELETE_REF_LINK_SUCCESS, GET_BILLING_HISTORY_SUCCESS, GET_REF_LINKS_SUCCESS } from './settings.actions'
import { SettingsState } from 'models/app-state.model'
import { actions } from 'store/admin/admin.actions'

const initialState: SettingsState = {
  billingHistory: {
    limit: 10,
    offset: 0,
    itemsCount: 0,
    itemsCountAll: 0,
    items: [],
  },
  refLinks: [],
};

export function settingsReducers(state = initialState, action: actions) {
  switch (action.type) {
    case GET_BILLING_HISTORY_SUCCESS:
      return {
        ...state,
        billingHistory: action.payload
      };
    case GET_REF_LINKS_SUCCESS:
      return {
        ...state,
        refLinks: action.payload
      };
    case DELETE_REF_LINK_SUCCESS:
      const refLinks = state.refLinks.filter(el => el.id !== action.payload)
      return {
        ...state,
        refLinks: refLinks,
      };
    default:
      return state;
  }
}
