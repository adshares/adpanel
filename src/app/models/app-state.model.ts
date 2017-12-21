import { AuthState } from './auth-state.model';
import { AdvertiserState } from './advertiser-state.model';
import { SettingsState } from './settings-state.model';

export interface AppState {
  state: {
    auth: AuthState,
    advertiser: AdvertiserState,
    settings: SettingsState
  };
}
