import * as moment from 'moment';

import { Campaign, CampaignTotals } from 'models/campaign.model';
import { campaignStatusesEnum } from 'models/enum/campaign.enum';
import { classificationStatusesEnum } from 'models/enum/classification.enum';

export const campaignsTotalsInitialState: CampaignTotals = {
  campaignId: 0,
  totalBudget: 0,
  clicks: 0,
  impressions: 0,
  ctr: 0,
  averageCpc: 0,
  cost: 0
};

export const campaignInitialState: Campaign = {
  basicInformation: {
    status: campaignStatusesEnum.DRAFT,
    name: '',
    targetUrl: '',
    maxCpc: null,
    maxCpm: null,
    budget: null,
    dateStart: moment(new Date()).format('l LT'),
  },

  targeting: {
    requires: {},
    excludes: {},
  },

  targetingArray: {
    excludes: [],
    requires: []
  },

  ads: [],

  id: 0,

  classificationStatus: classificationStatusesEnum.DISABLED,
};
