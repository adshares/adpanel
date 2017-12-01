import { combineReducers, ActionReducer } from '@ngrx/store/';

import { authReducers } from './auth/auth.reducer';
import { AppState } from '../models/app-state.model';

const reducers: ActionReducer<AppState> = combineReducers({auth: authReducers});

export { reducers, AppState };
