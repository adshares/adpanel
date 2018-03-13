import { Site } from '../site.model';
import { siteStatusEnum, primaryLanguageEnum } from '../enum/site.enum'

export const siteInitialState: Site = {
  id: 0,
  status: siteStatusEnum.DRAFT,
  websiteUrl: '',
  primaryLanguage: primaryLanguageEnum.POLISH,
  targetingArray: {
    requires: [],
    excludes: []
  },
  adUnits: []
};
