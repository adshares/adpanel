import * as _moment from 'moment';

import { Campaign } from '../campaign.model';
import { campaignStatusesEnum } from '../enum/campaign.enum';

const moment = _moment;

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
