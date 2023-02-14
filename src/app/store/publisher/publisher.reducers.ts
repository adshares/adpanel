import * as PublisherActions from './publisher.actions';
import * as AuthActions from '../auth/auth.actions';
import { siteInitialState, sitesTotalsInitialState } from 'models/initial-state/site';
import { PublisherState } from 'models/app-state.model';

const initialState: PublisherState = {
  sites: [],
  sitesLoaded: false,
  sitesTotals: sitesTotalsInitialState,
  dataLoaded: false,
  lastEditedSite: siteInitialState,
  languagesList: [],
};
const unitStatsInitialState = {
  clicks: 0,
  impressions: 0,
  ctr: 0,
  averageRpm: 0,
  averageRpc: 0,
  revenue: 0,
};

export function publisherReducers(state = initialState, action: PublisherActions.actions | AuthActions.actions) {
  switch (action.type) {
    case PublisherActions.LOAD_SITES:
      return {
        ...state,
        dataLoaded: false,
        sitesLoaded: false,
      };
    case PublisherActions.LOAD_SITES_SUCCESS:
      return {
        ...state,
        sites: action.payload,
        sitesLoaded: true,
      };
    case PublisherActions.LOAD_SITE:
      return {
        ...state,
        dataLoaded: false,
      };
    case PublisherActions.LOAD_SITE_SUCCESS: {
      const _sites = [...state.sites];
      const i = _sites.findIndex(el => el.id === action.payload.id);
      if (-1 !== i) {
        _sites[i] = action.payload;
      } else {
        _sites.push(action.payload);
      }

      return {
        ...state,
        sites: _sites,
      };
    }
    case PublisherActions.LOAD_SITES_TOTALS_SUCCESS:
      if (action.payload.data.length <= 0) {
        return {
          ...state,
          dataLoaded: true,
          sitesTotals: action.payload.total,
        };
      }

      const sitesWithTotal = [state.sites, action.payload.data].reduce((sites, data) =>
        sites.map(site => {
          const elWithStats = data.find(el => el.siteId === site.id);
          return elWithStats
            ? {
                ...site,
                ...elWithStats,
              }
            : site;
        })
      );

      return {
        ...state,
        dataLoaded: true,
        sites: sitesWithTotal,
        sitesTotals: action.payload.total,
      };

    case PublisherActions.LOAD_SITE_TOTALS_SUCCESS: {
      const _sites = [...state.sites];
      const i = _sites.findIndex(el => el.id === action.payload.total.siteId);

      let unitStats = [];
      if (action.payload.data.length > 0 && _sites[i].adUnits !== undefined && _sites[i].adUnits.length > 0) {
        unitStats = [_sites[i].adUnits, action.payload.data].reduce((units, data) =>
          units.map(unit => {
            const elementWithStats = data.find(el => el.zoneId === unit.id);
            return elementWithStats
              ? {
                  ...unit,
                  ...elementWithStats,
                }
              : unit;
          })
        );
      } else {
        unitStats = _sites[i].adUnits.map(el => {
          return {
            ...el,
            ...unitStatsInitialState,
          };
        });
      }

      _sites[i] = {
        ..._sites[i],
        ...action.payload.total,
        adUnits: unitStats,
      };

      return {
        ...state,
        dataLoaded: true,
        sites: _sites,
      };
    }
    case PublisherActions.SAVE_LAST_EDITED_SITE:
      return {
        ...state,
        lastEditedSite: { ...state.lastEditedSite, ...action.payload },
      };
    case PublisherActions.CLEAR_LAST_EDITED_SITE:
      return {
        ...state,
        lastEditedSite: { ...siteInitialState },
      };
    case PublisherActions.SET_LAST_EDITED_SITE:
      return {
        ...state,
        lastEditedSite: { ...action.payload },
      };
    case PublisherActions.SAVE_LAST_EDITED_SITE_FILTERING:
      return {
        ...state,
        lastEditedSite: {
          ...state.lastEditedSite,
          filteringArray: action.payload,
        },
      };
    case PublisherActions.SAVE_LAST_EDITED_SITE_ONLY_ACCEPTED_BANNERS:
      return {
        ...state,
        lastEditedSite: {
          ...state.lastEditedSite,
          onlyAcceptedBanners: action.payload,
        },
      };
    case PublisherActions.SAVE_LAST_EDITED_SITE_AD_UNITS:
      return {
        ...state,
        lastEditedSite: {
          ...state.lastEditedSite,
          adUnits: action.payload,
        },
      };
    case PublisherActions.ADD_SITE_TO_SITES_SUCCESS:
      return {
        ...state,
        sites: [...state.sites, action.payload],
      };

    case PublisherActions.GET_LANGUAGES_LIST_SUCCESS:
      return {
        ...state,
        languagesList: [...action.payload],
      };

    case PublisherActions.UPDATE_SITE_SUCCESS:
    case PublisherActions.UPDATE_SITE_STATUS_SUCCESS:
      const siteIndex = state.sites.findIndex(site => site.id === action.payload.id);
      const oldSites = [...state.sites];
      const oldSite = oldSites.splice(siteIndex, 1)[0];
      const updatedSite = {
        ...oldSite,
        ...action.payload,
      };
      oldSites.splice(siteIndex, 0, updatedSite);
      return {
        ...state,
        sites: [...oldSites],
      };

    case AuthActions.USER_LOG_IN_SUCCESS:
      return initialState;

    case AuthActions.USER_LOG_OUT_SUCCESS:
    default:
      return state;
  }
}
