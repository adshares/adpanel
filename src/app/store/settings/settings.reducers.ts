import {
  ADD_ACCESS_TOKEN_SUCCESS,
  DELETE_ACCESS_TOKEN_SUCCESS,
  DELETE_REF_LINK_SUCCESS,
  GET_ACCESS_TOKENS_SUCCESS,
  GET_BILLING_HISTORY_SUCCESS,
  GET_REF_LINKS_SUCCESS,
} from './settings.actions';
import { SettingsState } from 'models/app-state.model';
import { actions } from 'store/admin/admin.actions';
import { AccessTokenResponse, AccessTokenResponseWithSecret, AccessTokenStore } from 'models/access-token.model';

const initialState: SettingsState = {
  accessTokens: [],
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

function mapAccessTokenToStore(accessToken: AccessTokenResponse): AccessTokenStore {
  return <AccessTokenStore>{
    id: accessToken.id,
    name: accessToken.name,
    scopes: accessToken.scopes,
    expiresAt: accessToken.expiresAt,
  };
}

export function settingsReducers(state = initialState, action: actions) {
  switch (action.type) {
    case GET_ACCESS_TOKENS_SUCCESS: {
      return {
        ...state,
        accessTokens: (<AccessTokenResponse[]>action.payload).map(accessToken => mapAccessTokenToStore(accessToken)),
      };
    }
    case ADD_ACCESS_TOKEN_SUCCESS: {
      return {
        ...state,
        accessTokens: [
          mapAccessTokenToStore((<AccessTokenResponseWithSecret>action.payload).token),
          ...state.accessTokens,
        ],
      };
    }
    case DELETE_ACCESS_TOKEN_SUCCESS: {
      const id = action.payload;
      const accessTokens = state.accessTokens.filter(el => el.id !== id);
      return {
        ...state,
        accessTokens: accessTokens,
      };
    }
    case GET_BILLING_HISTORY_SUCCESS:
      return {
        ...state,
        billingHistory: action.payload,
      };
    case GET_REF_LINKS_SUCCESS:
      return {
        ...state,
        refLinks: action.payload,
      };
    case DELETE_REF_LINK_SUCCESS:
      const data = state.refLinks.data.filter(el => el.id !== action.payload);
      return {
        ...state,
        refLinks: {
          ...state.refLinks,
          data: data,
        },
      };
    default:
      return state;
  }
}
