import { Campaign, CampaignsConfig, CampaignTotals } from './campaign.model';
import { Site, SiteLanguage, SitesTotals } from './site.model';
import {
  AdminSettings,
  Advertisers,
  BillingHistory,
  License,
  PaginatorResponse,
  Publishers,
  RefLink,
  Users,
} from './settings.model';
import { User } from './user.model';
import { ChartFilterSettings } from './chart/chart-filter-settings.model';
import { AccessTokenStore } from 'models/access-token.model';
import { Info, Placeholders } from 'models/info.model';

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
}

interface SettingsState {
  accessTokens: AccessTokenStore[];
  billingHistory: BillingHistory;
  refLinks: PaginatorResponse<RefLink>;
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
  license: License | null;
  panelBlockade: boolean;
}

interface CommonState {
  info: Info;
  activeUserType: number;
  chartFilterSettings: ChartFilterSettings;
  impersonationToken: string;
  placeholders: Placeholders;
}

export { AppState, UserState, AdvertiserState, PublisherState, SettingsState, AdminState, CommonState };
