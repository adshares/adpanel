import { User } from './user.model';
import { Campaign } from './campaign.model';
import { Site } from './site.model';
import { BillingHistoryItem } from './settings.model';
import { NotificationItem } from './settings.model';

interface AppState {
  state: {
    auth: AuthState,
    advertiser: AdvertiserState,
    publisher: PublisherState,
    settings: SettingsState
  };
}

interface AuthState {
  userData: User;
}

interface AdvertiserState {
  lastEditedCampaign: Campaign;
  campaigns: Campaign[];
}

interface PublisherState {
  sites: Site[];
}

interface SettingsState {
  billingHistory: BillingHistoryItem[];
  notificationsSettings: NotificationItem[];
}

export { AppState, AuthState, AdvertiserState, PublisherState, SettingsState};
