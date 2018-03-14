import * as moment from 'moment';

import { Campaign } from 'models/campaign.model';
import { campaignStatusesEnum } from 'models/enum/campaign.enum';

export const campaignInitialState: Campaign = {
  basicInformation: {
    status: campaignStatusesEnum.DRAFT,
    name: '',
    targetUrl: '',
    bidStrategyName: '',
    bidValue: null,
    budget: null,
    dateStart: moment(new Date()).format('L'),
  },

  targetingArray: {
    excludes: [],
    requires: []
  },

  ads: [],

  id: 0
};
