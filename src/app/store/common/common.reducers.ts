import * as commonActions from './common.actions';
import { chartFilterSettingsInitialState } from 'models/initial-state/chart-filter-settings';
import { CommonState } from 'models/app-state.model'

const initialState: CommonState = {
  activeUserType: 1,
  chartFilterSettings: chartFilterSettingsInitialState,
  impersonationToken: null,
  info: null,
};

export function commonReducers(state = initialState, action: commonActions.actions) {
  switch (action.type) {
    case commonActions.LOAD_INFO_SUCCESS:
      return {
        ...state,
        info: action.payload
      };
    case commonActions.SET_ACTIVE_USER_TYPE:
      return {
        ...state,
        activeUserType: action.payload
      };
    case commonActions.SET_CHART_FILTER_SETTINGS:
      return {
        ...state,
        chartFilterSettings: Object.assign({}, action.payload)
      };
    default:
      return state;
  }
}
