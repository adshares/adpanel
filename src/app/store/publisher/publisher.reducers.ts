import * as PublisherActions from './publisher.actions';
import { siteInitialState } from '../../models/initial-state/site';
import { PublisherState } from '../../models/app-state.model';

const initialState: PublisherState = {
  sites: [],
  lastEditedSite: siteInitialState
};

export function publisherReducers(state = initialState, action: PublisherActions.actions) {
  switch (action.type) {
    case PublisherActions.LOAD_SITES_SUCCESS:
      return {
        ...state,
        sites: action.payload
      };
    case PublisherActions.SAVE_LAST_EDITED_SITE:
      return {
        ...state,
        lastEditedSite: Object.assign({}, state.lastEditedSite, action.payload)
      };
    case PublisherActions.CLEAR_LAST_EDITED_SITE:
      return {
        ...state,
        lastEditedSite: Object.assign({}, siteInitialState)
      };
    case PublisherActions.SET_LAST_EDITED_SITE:
      return {
        ...state,
        lastEditedSite: Object.assign({}, action.payload)
      };
    case PublisherActions.SAVE_LAST_EDITED_SITE_AD_UNITS:
      return {
        ...state,
        lastEditedSite: Object.assign({}, state.lastEditedSite, { adUnits: action.payload })
      };
    case PublisherActions.ADD_SITE_TO_SITES:
      return {
        ...state,
        sites: [...state.sites, action.payload]
      };
    default:
      return state;
  }
}
