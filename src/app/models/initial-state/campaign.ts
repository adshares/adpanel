import * as moment from 'moment';

import { Campaign, CampaignsTotals } from 'models/campaign.model';
import { campaignStatusesEnum } from 'models/enum/campaign.enum';
import { classificationStatusesEnum } from 'models/enum/classification.enum';

export const campaignsTotalsInitialState: CampaignsTotals = {
  totalBudget: 0,
  totalClicks: 0,
  totalImpressions: 0,
  averageCTR: 0,
  averageCPC: 0,
  totalCost: 0
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
