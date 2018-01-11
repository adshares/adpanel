import { combineReducers, ActionReducer } from '@ngrx/store/';

import { authReducers } from './auth/auth.reducer';
import { advertiserReducers } from './advertiser/advertiser.reducer';
import { publisherReducers } from './publisher/publisher.reducer';
import { settingsReducer } from './settings/settings.reducer';
import { AuthState } from '../models/auth-state.model';
import { AdvertiserState } from '../models/advertiser-state.model';
import { PublisherState } from '../models/publisher-state.model';
import { SettingsState } from '../models/settings-state.model';
import { UserState } from '../models/user-state.model';

export interface UserReducersState {
  data: AuthState;
  settings: SettingsState;
};

export interface ReducersState {
  user: UserState;
  advertiser: AdvertiserState;
  publisher: PublisherState;
};

const userReducers: ActionReducer<UserReducersState> = combineReducers(
  {
    data: authReducers,
    settings: settingsReducer
  }
);

export const reducers: ActionReducer<ReducersState> = combineReducers(
  {
    user: userReducers,
    advertiser: advertiserReducers,
    publisher: publisherReducers,
  }
);
