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
  refLinks: {
    currentPage: 0,
    data: [],
    firstPageUrl: '',
    from: 0,
    lastPage: 0,
    lastPageUrl: '',
    links: [],
    nextPageUrl: null,
    path: '',
    perPage: 0,
    prevPageUrl: null,
    to: 0,
    total: 0,
  },
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
      const data = state.refLinks.data.filter(el => el.id !== action.payload)
      return {
        ...state,
        refLinks: {
          ...state.refLinks,
          data: data
        },
      };
    default:
      return state;
  }
}
