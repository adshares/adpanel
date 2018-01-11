import { AuthState } from './auth-state.model';
import { SettingsState } from './settings-state.model';

export interface UserState {
  data: AuthState;
  settings: SettingsState;
}
