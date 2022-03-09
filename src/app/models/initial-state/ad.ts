import { Ad } from 'models/campaign.model';
import {
  adStatusesEnum,
  adCreativeTypes,
} from 'models/enum/ad.enum';

export const adInitialState: Ad = {
  id: 0,
  status: adStatusesEnum.ACTIVE,
  name: '',
  creativeSize: null,
  creativeType: adCreativeTypes.IMAGE,
  clicks: 0,
  impressions: 0,
  ctr: 0,
  averageCpc: 0,
  averageCpm: 0,
  cost: 0,
  budget: 0,
  url: null
};
