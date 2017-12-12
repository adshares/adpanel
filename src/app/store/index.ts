import { combineReducers, ActionReducer } from '@ngrx/store/';

import { authReducers } from './auth/auth.reducer';
import { AuthState } from '../models/auth-state.model';
import { AppState } from '../models/app-state.model';

export interface reducersState {
  auth: AuthState;
};

export const reducers: ActionReducer<reducersState> = combineReducers({auth: authReducers});
