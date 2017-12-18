import { AuthState } from './auth-state.model';
import { AdvertiserState } from './advertiser-state.model';
import { PublisherState } from './publisher-state.model';
import { SettingsState } from './settings-state.model';

export interface AppState {
  state: {
    auth: AuthState,
    advertiser: AdvertiserState,
    publisher: PublisherState,
    settings: SettingsState
  };
}
