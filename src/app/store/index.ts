import { combineReducers, ActionReducer } from '@ngrx/store/';

import { authReducers, AuthState } from './auth/auth.reducer';

interface AppState {
  auth: AuthState
};

const reducers: ActionReducer<AppState> = combineReducers({auth: authReducers});

export { reducers, AppState };
