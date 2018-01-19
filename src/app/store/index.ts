import { combineReducers, ActionReducer } from '@ngrx/store/';

import { authReducers } from './auth/auth.reducer';
import { advertiserReducers } from './advertiser/advertiser.reducer';
import { publisherReducers } from './publisher/publisher.reducer';
import { settingsReducers } from './settings/settings.reducer';
import { UserState, PublisherState, AdvertiserState } from '../models/app-state.model';

export interface ReducersState {
  user: UserState;
  advertiser: AdvertiserState;
  publisher: PublisherState;
};

const userReducers: ActionReducer<UserState> = combineReducers(
  {
    data: authReducers,
    settings: settingsReducers
  }
);

export const reducers: ActionReducer<ReducersState> = combineReducers(
  {
    user: userReducers,
    advertiser: advertiserReducers,
    publisher: publisherReducers,
  }
);
