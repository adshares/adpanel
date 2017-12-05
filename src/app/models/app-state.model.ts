import { AuthState } from './auth-state.model';

export interface AppState {
  state: {
    auth: AuthState;
  }
};
