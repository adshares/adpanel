import { Site } from '../site.model';

export const siteInitialState: Site = {
  id: 0,
  status: 0,
  websiteUrl: '',
  primaryLanguage: 'polish',
  targetingArray: {
    requires: [],
    excludes: []
  },
  adUnits: []
}
