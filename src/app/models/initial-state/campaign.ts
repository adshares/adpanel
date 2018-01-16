import { Campaign } from '../campaign.model';

export const campaignInitialState: Campaign = {
  basicInformation: {
    status: 0,
    name: '',
    targetUrl: '',
    bidStrategyName: '',
    bidValue: 0,
    budget: 0,
    dateStart: new Date()
  },

  targeting: {
    excludes: [],
    requires: []
  },

  id: 0
}
