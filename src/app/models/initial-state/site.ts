import { Site, SitesTotals } from 'models/site.model';
import { siteStatusEnum, primaryLanguageEnum } from 'models/enum/site.enum';

export const sitesTotalsInitialState: SitesTotals = {
  totalEarnings: 0,
  totalClicks: 0,
  totalImpressions: 0,
  averagePageRPM: 0,
  averageCPC: 0
}

export const siteInitialState: Site = {
  id: 0,
  status: siteStatusEnum.DRAFT,
  name: '',
  primaryLanguage: primaryLanguageEnum.POLISH,
  filtering: {
    requires: [],
    excludes: []
  },
  adUnits: []
};
