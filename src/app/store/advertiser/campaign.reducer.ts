import { Campaign } from '../../models/campaign.model';

const initialState = {
  campaigns: [
    {
      id: 377892908378478,
      status: 'active',
      name: 'Campaign for Education',
      targetUrl: 'www.adshares.net',
      bidStrategyName: 'CPC',
      bidStrategyValue: 0.2,
      budget: 455,
      dateStart: new Date(),

      clicks: 213,
      impressions: 12435,
      ctr: 0.03,
      averageCPC: 2.1,
      cost: 2435.23,
      conversions: 802,

      targeting: {
        requires: {
          languages: ['Polish', 'English'],
          devices: [],
          genders: [],
          operatingSystems: [],
          browsers: [],
        },
        excludes: {
          languages: ['German', 'French'],
          devices: [],
          genders: [],
          operatingSystems: [],
          browsers: [],
        }
      },
      ads: [
        {
          status: 'active',
          shortHeadline: 'Adshares Dashboard Advertisement',
          type: 'image',

          budget: 20,
          clicks: 100,
          impressions: 1233422132,
          ctr: 0.00001233,
          averageCPC: 1.2,
          cost: 2435.23,
        },
        {
          status: 'limited',
          shortHeadline: 'Adshares Website Advertisement',
          type: 'image',

          budget: 20,
          clicks: 200,
          impressions: 21313545,
          ctr: 0.1233,
          averageCPC: 3.25,
          cost: 8236.23,
        },
      ]
    },
    {
      id: 36758990809093888,
      status: 'draft',
      name: 'Campaign for Schools',
      targetUrl: 'www.adshares.net',
      bidStrategyName: 'CPC',
      bidStrategyValue: 0.2,
      budget: 23,
      dateStart: new Date(),

      clicks: 23266,
      impressions: 5904343,
      ctr: 0.13,
      averageCPC: 4.1,
      cost: 232455.23,

      targeting: {
        requires: {
          languages: ['Polish', 'English'],
          devices: [],
          genders: [],
          operatingSystems: [],
          browsers: [],
        },
        excludes: {
          languages: ['German', 'French'],
          devices: [],
          genders: [],
          operatingSystems: [],
          browsers: [],
        }
      },
      ads: [
        {
          status: 'active',
          shortHeadline: 'Adshares Dashboard Advertisement',
          type: 'image',

          budget: 20,
          clicks: 100,
          impressions: 1233422132,
          ctr: 0.00001233,
          averageCPC: 1.2,
          cost: 2435.23,
          conversions: 220,
        },
        {
          status: 'active',
          shortHeadline: 'Adshares Website Advertisement',
          type: 'image',

          budget: 20,
          clicks: 200,
          impressions: 21313545,
          ctr: 0.1233,
          averageCPC: 3.25,
          cost: 8236.23,
        },
      ]
    },
  ]
};

export function campaignReducers(state = initialState) {
  return state;
}
