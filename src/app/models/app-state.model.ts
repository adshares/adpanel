import { Campaign, CampaignTotals } from './campaign.model';
import { Site, SiteLanguage, SitesTotals } from './site.model';
import { AdminSettings, NotificationItem, UserInfoStats } from './settings.model';
import { User } from './user.model';
import { ChartFilterSettings } from './chart/chart-filter-settings.model';
import { Notification } from 'models/notification.model';
import {TargetingOption} from "models/targeting-option.model";


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
  campaigns: Campaign[] | null;
  campaignsTotals: CampaignTotals[];
}

interface PublisherState {
  sites: Site[];
  sitesTotals: SitesTotals;
  lastEditedSite: Site;
  languagesList: SiteLanguage[];
  filteringCriteria: TargetingOption[];
}

interface SettingsState {
  notificationsSettings: NotificationItem[];
  totalFunds: number;
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
