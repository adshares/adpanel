import { Ad } from 'models/campaign.model';
import { adSizesEnum, adStatusesEnum, adTypesEnum } from 'models/enum/ad.enum';

export const adInitialState: Ad = {
  id: 0,
  status: adStatusesEnum.ACTIVE,
  name: '',
  type: adTypesEnum.IMAGE,
  size: adSizesEnum['728x90'],
  clicks: 0,
  impressions: 0,
  ctr: 0,
  averageCpc: 0,
  cost: 0,
  budget: 0,
  bannerUrl: null
};
