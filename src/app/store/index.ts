import { combineReducers, ActionReducer } from '@ngrx/store/';

import { authReducers } from './auth/auth.reducer';
import { advertiserReducers } from './advertiser/advertiser.reducer';
import { AuthState } from '../models/auth-state.model';
import { AppState } from '../models/app-state.model';

export interface ReducersState {
  auth: AuthState;
};

export const reducers: ActionReducer<ReducersState> = combineReducers(
  {
    auth: authReducers,
    advertiser: advertiserReducers
  }
);
