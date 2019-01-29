import * as PublisherActions from './publisher.actions';
import * as authActions  from '../auth/auth.actions';
import {siteInitialState, sitesTotalsInitialState} from 'models/initial-state/site';
import {PublisherState} from 'models/app-state.model';

const initialState: PublisherState = {
  sites: [],
  sitesTotals: sitesTotalsInitialState,
  lastEditedSite: siteInitialState,
  languagesList: [],
  filteringCriteria: [],
};

export function publisherReducers(state = initialState, action: PublisherActions.actions | authActions.actions) {
  switch (action.type) {
    case PublisherActions.LOAD_SITES_SUCCESS:
      return {
        ...state,
        sites: action.payload
      };

      case PublisherActions.LOAD_SITE_SUCCESS:
      return {
        ...state,
        sites: [
          ...state.sites,
          {
            ...siteInitialState,
            ...action.payload
          }
        ]
      };
    case PublisherActions.LOAD_SITES_TOTALS_SUCCESS:
      const sitesWithTotal = [];
      if (action.payload.data.length <= 0) {
        return {
          ...state,
          sitesTotals: action.payload.total
        }
      }
      state.sites.forEach(site => {
        action.payload.data.forEach(data => {
          if (!sitesWithTotal.length || sitesWithTotal.find(el => el.id !== site.id)) {
            if (data.siteId === site.id) {
              sitesWithTotal.push({
                ...site,
                ...data
              })
            } else {
              sitesWithTotal.push({
                ...site,
              })
            }
          }

        })
      });

      return {
        ...state,
        sites: sitesWithTotal,
        sitesTotals: action.payload.total
      };
    case PublisherActions.SAVE_LAST_EDITED_SITE:
      return {
        ...state,
        lastEditedSite: {...state.lastEditedSite, ...action.payload}
      };
    case PublisherActions.CLEAR_LAST_EDITED_SITE:
      return {
        ...state,
        lastEditedSite: {...siteInitialState}
      };
    case PublisherActions.SET_LAST_EDITED_SITE:
      return {
        ...state,
        lastEditedSite: {...action.payload}
      };
    case PublisherActions.SAVE_LAST_EDITED_SITE_FILTERING:
      return {
        ...state,
        lastEditedSite: {
          ...state.lastEditedSite,
          filteringArray: action.payload
        }
      };
    case PublisherActions.SAVE_LAST_EDITED_SITE_AD_UNITS:
      return {
        ...state,
        lastEditedSite: {
          ...state.lastEditedSite,
          adUnits: action.payload
        }
      };
    case PublisherActions.ADD_SITE_TO_SITES_SUCCESS:
      return {
        ...state,
        sites: [...state.sites, action.payload]
      };

    case PublisherActions.GET_LANGUAGES_LIST_SUCCESS:
      return {
        ...state,
        languagesList: [...action.payload]
      };

    case PublisherActions.GET_FILTERING_CRITERIA_SUCCESS:
      return {
        ...state,
        filteringCriteria: [...action.payload]
      };

    case PublisherActions.UPDATE_SITE || PublisherActions.UPDATE_SITE_FILTERING:
      const oldSites = state.sites.filter(site => site.id !== action.payload.id);
      return {
        ...state,
        sites: [
          ...oldSites,
          ...action.payload
        ]
      };

    case authActions.USER_LOG_IN_SUCCESS:
    case authActions.USER_LOG_OUT_SUCCESS:
      return initialState;

    default:
      return state;
  }
}
