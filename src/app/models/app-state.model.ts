import { Campaign } from './campaign.model';
import { Site } from './site.model';
import {
  BillingHistoryItem,
  NotificationItem,
  UserInfoStats,
  AdminSettings
} from './settings.model';
import { User } from './user.model';
import { ChartFilterSettings } from './chart/chart-filter-settings.model';


interface AppState {
  state: {
    user: UserState;
    advertiser: AdvertiserState;
    publisher: PublisherState;
    admin: AdminState;
    common: CommonState;
  };
}

interface AdvertiserState {
  lastEditedCampaign: Campaign;
  campaigns: Campaign[];
}

interface PublisherState {
  lastEditedSite: Site;
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

interface AdminState {
  users: UserInfoStats[];
  settings: AdminSettings;
}

interface CommonState {
  activeUserType: number;
  adsharesEthAddress: string;
  chartFilterSettings: ChartFilterSettings;
}

export { AppState, UserState, AdvertiserState, PublisherState, SettingsState, AdminState, CommonState};
