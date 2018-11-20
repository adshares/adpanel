import { Campaign, CampaignsTotals } from './campaign.model';
import { Site, SiteLanguage, SitesTotals } from './site.model';
import { AdminSettings, BillingHistoryItem, NotificationItem, UserInfoStats } from './settings.model';
import { User } from './user.model';
import { ChartFilterSettings } from './chart/chart-filter-settings.model';
import { Notification } from 'models/notification.model';


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
  campaignsTotals: CampaignsTotals;
}

interface PublisherState {
  sites: Site[];
  sitesTotals: SitesTotals;
  lastEditedSite: Site;
  languagesList: SiteLanguage[];
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
  adsharesAddress: string;
  chartFilterSettings: ChartFilterSettings;
  notifications: Notification[];
}

export { AppState, UserState, AdvertiserState, PublisherState, SettingsState, AdminState, CommonState };
