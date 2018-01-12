import * as PublisherActions from './publisher.actions';

const initialState: any = {
  sites: []
};

export function publisherReducers(state = initialState, action: PublisherActions.actions) {
  switch (action.type) {
    case PublisherActions.LOAD_SITES_SUCCESS:
      return {
        ...state,
        sites: action.payload
      };
    default:
      return state;
  }
}
