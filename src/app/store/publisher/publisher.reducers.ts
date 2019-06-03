import * as PublisherActions from './publisher.actions';
import * as authActions from '../auth/auth.actions';
import { siteInitialState, sitesTotalsInitialState } from 'models/initial-state/site';
import { PublisherState } from 'models/app-state.model';

const initialState: PublisherState = {
  sites: [],
  sitesTotals: sitesTotalsInitialState,
  lastEditedSite: siteInitialState,
  languagesList: [],
  filteringCriteria: [],
};
const unitStatsInitialState = {
  clicks: 0,
  impressions: 0,
  ctr: 0,
  averageRpm: 0,
  averageRpc: 0,
  revenue: 0,
};

/** FIXME -> PAN-364 -> refactor reducer by creating class containing needed helper function and data
 * set to help modify data in less repetitive more readable way
 */

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
          ...state.sites.filter(el => el.id !== action.payload.id),
          {
            ...siteInitialState,
            ...action.payload
          }
        ]
      };
    case PublisherActions.LOAD_SITES_TOTALS_SUCCESS:
      if (action.payload.data.length <= 0) {
        return {
          ...state,
          sitesTotals: action.payload.total
        }
      }

      const sitesWithTotal = [state.sites, action.payload.data].reduce((sites, data) => sites.map(site => {
          const elWithStats = data.find(el => el.siteId === site.id);
          return elWithStats ? {
            ...site,
            ...elWithStats
          } : site;
        })
      );

      return {
        ...state,
        sites: sitesWithTotal,
        sitesTotals: action.payload.total
      };

    case PublisherActions.LOAD_SITE_TOTALS_SUCCESS:
      const selectedSite = state.sites.find(el => el.id === action.payload.total.siteId);
      const filteredSites = state.sites.filter(el => el.id !== action.payload.total.siteId);

      if (action.payload.data.length > 0 && selectedSite.adUnits !== undefined && selectedSite.adUnits.length > 0) {
        const reducedUnits = [selectedSite.adUnits, action.payload.data].reduce((units, data) => units.map((unit) => {
            const elementWithStats = data.find(el => el.zoneId === unit.id);
            return elementWithStats ? {
              ...unit,
              ...elementWithStats
            } : unit;
          })
        );
        return {
          ...state,
          sites: [...filteredSites, {
            ...selectedSite,
            ...action.payload.total,
            adUnits: reducedUnits,
          }],
        };
      }

      const resetUnitStats = selectedSite.adUnits.map(el => {
        return {
          ...el,
          ...unitStatsInitialState
        }
      });
      return {
        ...state,
        sites: [
          ...filteredSites,
          {
            ...selectedSite,
            adUnits: resetUnitStats,
            ...action.payload.total
          }
        ]
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

    case PublisherActions.UPDATE_SITE:
    case PublisherActions.UPDATE_SITE_FILTERING:
      const oldSites = state.sites.filter(site => site.id !== action.payload.id);
      return {
        ...state,
        sites: [
          ...oldSites,
          {
            ...action.payload
          }
        ]
      };

    case authActions.USER_LOG_IN_SUCCESS:
      return initialState;

    case authActions.USER_LOG_OUT_SUCCESS:
    default:
      return state;
  }
}
