import * as commonActions from './common.actions';

const initialState = {
  activeUserType: ''
};

export function commonReducers(state = initialState , action: commonActions.actions ) {
  switch (action.type) {
    case commonActions.SET_ACTIVE_USER_TYPE:
      return {
        ...state,
        activeUserType: action.payload
      };
     default:
      return state;
  }
}
