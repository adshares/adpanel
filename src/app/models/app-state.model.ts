import { Campaign } from './campaign.model';
import { Site } from './site.model';
import { BillingHistoryItem } from './settings.model';
import { NotificationItem } from './settings.model';
import { User } from './user.model';

interface AppState {
  state: {
    user: UserState,
    advertiser: AdvertiserState,
    publisher: PublisherState,
  };
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

interface UserState {
  data: User;
  settings: SettingsState;
}

export { AppState, UserState, AdvertiserState, PublisherState, SettingsState};
