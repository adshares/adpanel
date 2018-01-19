import { Campaign } from './campaign.model';
import { Site } from './site.model';
import { BillingHistoryItem } from './settings.model';
import { NotificationItem } from './settings.model';
import { User } from './user.model';
import { UserInfoStats } from './user-info-stats.model';

interface AppState {
  state: {
    user: UserState,
    advertiser: AdvertiserState,
    publisher: PublisherState,
    admin: UsersInfoStatsState
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

interface UsersInfoStatsState {
  users: UserInfoStats[]
}

export { AppState, UserState, AdvertiserState, PublisherState, SettingsState, UsersInfoStatsState};
