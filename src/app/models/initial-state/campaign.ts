import { Campaign } from '../campaign.model';

export const campaignInitialState: Campaign = {
  basicInformation: {
    status: 0,
    name: '',
    targetUrl: '',
    bidStrategyName: '',
    bidValue: null,
    budget: null,
    dateStart: new Date()
  },

  targetingArray: {
    excludes: [],
    requires: []
  },

  ads: [],

  id: 0
}
