import * as CommonAction from './common.action';

const initialState = {
  activeUserType: ''
};

export function commonReducers(state = initialState , action: CommonAction.actions ) {
  switch (action.type) {
    case CommonAction.SET_ACTIVE_USER_TYPE:
      return {
        ...state,
        activeUserType: action.payload
      };
     default:
      return state;
  }
}
