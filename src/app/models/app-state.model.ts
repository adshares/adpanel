import { AuthState } from './auth-state.model';
import { AdvertiserState } from './advertiser-state.model';
import { PublisherState } from './publisher-state.model';

export interface AppState {
  state: {
    user: AuthState,
    advertiser: AdvertiserState,
    publisher: PublisherState,
  };
}
