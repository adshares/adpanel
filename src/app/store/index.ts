import { combineReducers, ActionReducer } from '@ngrx/store/';

import { authReducers } from './auth/auth.reducer';
import { AuthState } from '../models/auth-state.model';
import { CampaignState } from '../models/campaign-state.model';
import { AppState } from '../models/app-state.model';

import { campaignReducers } from './advertiser/campaign.reducer';

export interface ReducersState {
  auth: AuthState,
  advertiser: any
};

export const reducers: ActionReducer<ReducersState> =
  combineReducers(
    {
      auth: authReducers,
      advertiser: campaignReducers
    }
  );
