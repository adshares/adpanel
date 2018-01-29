import { combineReducers, ActionReducer } from '@ngrx/store/';

import { authReducers } from './auth/auth.reducer';
import { advertiserReducers } from './advertiser/advertiser.reducer';
import { publisherReducers } from './publisher/publisher.reducer';
import { settingsReducers } from './settings/settings.reducer';
import { adminReducers } from './admin/admin.reducer';
import { UserState, PublisherState, AdvertiserState, AdminState, CommonState } from '../models/app-state.model';
import { commonReducers } from './common/common.reducer';

export interface ReducersState {
  user: UserState;
  advertiser: AdvertiserState;
  publisher: PublisherState;
  admin: AdminState;
  common: CommonState;
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
    admin: adminReducers,
    common: commonReducers
  }
);
