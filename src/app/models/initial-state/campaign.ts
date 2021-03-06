import { Campaign, CampaignConversionItem, CampaignsConfig, CampaignTotals } from 'models/campaign.model';
import { campaignConversionClick, campaignStatusesEnum } from 'models/enum/campaign.enum';
import {classificationStatusesEnum} from 'models/enum/classification.enum';
import * as moment from 'moment';

export const campaignsConfigInitialState: CampaignsConfig = {
  minBudget: 0,
  minCpm: 0,
  minCpa: 0,
};

export const campaignsTotalsInitialState: CampaignTotals = {
  clicks: 0,
  impressions: 0,
  ctr: 0,
  averageCpc: 0,
  averageCpm: 0,
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
    dateStart: moment().format(),
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
  conversions: [],
  secret: '',
  conversionClick: campaignConversionClick.NONE,
  classificationStatus: classificationStatusesEnum.DISABLED,
  classifications: [],
};

export const campaignConversionItemInitialState: CampaignConversionItem = {
  name: '',
  eventType: '',
  isAdvanced: false,
  isInBudget: true,
  value: null,
};

