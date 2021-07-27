import { Campaign, CampaignsConfig, CampaignTotals } from './campaign.model';
import { Site, SiteLanguage, SitesTotals } from './site.model';
import {
  AdminSettings,
  AdminWallet,
  Advertisers,
  BillingHistory,
  Index,
  License,
  NotificationItem,
  Publishers,
  RefLink,
  TermsAndPrivacy,
  Users,
} from './settings.model';
import { User } from './user.model';
import { ChartFilterSettings } from './chart/chart-filter-settings.model';
import { Notification } from 'models/notification.model';
import { TargetingOption } from 'models/targeting-option.model';

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
  campaignsLoaded: boolean;
  campaignsTotals: CampaignTotals;
  campaignsConfig: CampaignsConfig;
  dataLoaded: boolean;
}

interface PublisherState {
  sites: Site[];
  sitesLoaded: boolean;
  sitesTotals: SitesTotals;
  dataLoaded: boolean;
  lastEditedSite: Site;
  languagesList: SiteLanguage[];
  filteringCriteria: TargetingOption[];
}

interface SettingsState {
  notificationsSettings: NotificationItem[];
  billingHistory: BillingHistory;
  refLinks: RefLink[];
}

interface UserState {
  data: User;
  settings: SettingsState;
}

interface AdminState {
  users: Users;
  advertisers: Advertisers;
  publishers: Publishers;
  settings: AdminSettings;
  wallet: AdminWallet;
  termsAndPrivacy: TermsAndPrivacy;
  rejectedDomains: string[];
  license: License | null;
  index: Index | null;
  panelBlockade: boolean;
}

interface CommonState {
  activeUserType: number;
  adsharesAddress: string;
  chartFilterSettings: ChartFilterSettings;
  notifications: Notification[];
  impersonationToken: string;
}

export { AppState, UserState, AdvertiserState, PublisherState, SettingsState, AdminState, CommonState };
