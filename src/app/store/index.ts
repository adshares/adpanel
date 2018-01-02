import { combineReducers, ActionReducer } from '@ngrx/store/';

import { authReducers } from './auth/auth.reducer';
import { advertiserReducers } from './advertiser/advertiser.reducer';
import { publisherReducers } from './publisher/publisher.reducer';
import { settingsReducer } from './settings/settings.reducer';
import { AuthState } from '../models/auth-state.model';

export interface ReducersState {
  auth: AuthState;
};

export const reducers: ActionReducer<ReducersState> = combineReducers(
  {
    auth: authReducers,
    advertiser: advertiserReducers,
    publisher: publisherReducers,
    settings: settingsReducer
  }
);
