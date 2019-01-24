import * as PublisherActions from './publisher.actions';
import {siteInitialState, sitesTotalsInitialState} from 'models/initial-state/site';
import {PublisherState} from 'models/app-state.model';

const initialState: PublisherState = {
  sites: [],
  sitesTotals: sitesTotalsInitialState,
  lastEditedSite: siteInitialState,
  languagesList: [],
  filteringCriteria: [],
};

export function publisherReducers(state = initialState, action: PublisherActions.actions) {
  switch (action.type) {
    case PublisherActions.LOAD_SITES_SUCCESS:
      return {
        ...state,
        sites: action.payload
      };
    case PublisherActions.LOAD_SITES_TOTALS_SUCCESS:
      const sites = state.sites.map(site => {
        const matchingSite = action.payload.find(stats => stats.siteId === site.id);
        if (!matchingSite) return site;
        return {
          ...site,
          ...matchingSite
        }
      })
      return {
        ...state,
        sites,
        // sitesTotals: action.payload
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
          filtering: action.payload
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

    default:
      return state;
  }
}
