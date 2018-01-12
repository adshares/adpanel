import { AdvertiserState } from './advertiser-state.model';
import { PublisherState } from './publisher-state.model';
import { UserState } from './user-state.model';

export interface AppState {
  state: {
    user: UserState,
    advertiser: AdvertiserState,
    publisher: PublisherState,
  };
}
