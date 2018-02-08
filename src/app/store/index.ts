import { combineReducers, ActionReducer } from '@ngrx/store/';

import { authReducers } from './auth/auth.reducers';
import { advertiserReducers } from './advertiser/advertiser.reducers';
import { publisherReducers } from './publisher/publisher.reducers';
import { settingsReducers } from './settings/settings.reducers';
import { adminReducers } from './admin/admin.reducers';
import { UserState, PublisherState, AdvertiserState, AdminState, CommonState } from '../models/app-state.model';
import { commonReducers } from './common/common.reducers';

export interface ReducersState {
  user: UserState;
  advertiser: AdvertiserState;
  publisher: PublisherState;
  admin: AdminState;
  common: CommonState;
}

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
