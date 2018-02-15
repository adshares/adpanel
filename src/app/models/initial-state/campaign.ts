import * as _moment from 'moment';

import { Campaign } from '../campaign.model';

const moment = _moment;

export const campaignInitialState: Campaign = {
  basicInformation: {
    status: 0,
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
