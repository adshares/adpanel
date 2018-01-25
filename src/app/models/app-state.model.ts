import { Campaign } from './campaign.model';
import { Site } from './site.model';
import {
  BillingHistoryItem,
  NotificationItem,
  UserInfoStats,
  AdminSettings } from './settings.model';
import { User } from './user.model';

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
  users: UserInfoStats[];
  settings: AdminSettings;
}

export { AppState, UserState, AdvertiserState, PublisherState, SettingsState, UsersInfoStatsState};
