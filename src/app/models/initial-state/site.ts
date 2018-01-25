import { Site } from '../site.model';

export const siteInitialState: Site = {
  id: 0,
  name: '',
  websiteUrl: '',
  primaryLanguage: 'polish',
  targeting: {
    requires: [],
    excludes: []
  },
}
