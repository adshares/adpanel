import { Site, SitesTotals } from 'models/site.model';
import { siteStatusEnum } from 'models/enum/site.enum';

export const sitesTotalsInitialState: SitesTotals = {
  averageRpc: 0,
  averageRpm: 0,
  clicks: 0,
  ctr: 0,
  impressions: 0,
  revenue: 0,
};

export const siteInitialState: Site = {
  id: 0,
  status: siteStatusEnum.DRAFT,
  name: '',
  domain: '',
  url: '',
  primaryLanguage: '',
  medium: 'web',
  vendor: null,
  onlyAcceptedBanners: false,
  filtering: {
    requires: {},
    excludes: {},
  },
  filteringArray: {
    requires: [],
    excludes: [],
  },
  adUnits: [],
  rejectReason: null,
};
