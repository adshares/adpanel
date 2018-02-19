import * as commonActions from './common.actions';
import { chartFilterSettingsInitialState } from '../../models/initial-state/chart-filter-settings';

const initialState = {
  activeUserType: 1,
  chartFilterSettings: chartFilterSettingsInitialState
};

export function commonReducers(state = initialState , action: commonActions.actions ) {
  switch (action.type) {
    case commonActions.SET_ACTIVE_USER_TYPE:
      return {
        ...state,
        activeUserType: action.payload
      };
    case commonActions.SET_CHART_FILTER_SETTINGS:
      console.log(action.payload)
      return {
        ...state,
        chartFilterSettings: action.payload
      };
     default:
      return state;
  }
}
