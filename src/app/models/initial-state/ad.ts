import { Ad } from 'models/campaign.model';
import { adStatusesEnum, adTypesEnum, adSizesEnum } from 'models/enum/ad.enum';

export const adInitialState: Ad = {
  id: 0,
  status: adStatusesEnum.DRAFT,
  name: '',
  type: adTypesEnum.IMAGE,
  size: adSizesEnum['728x90'],
  clicks: 0,
  impressions: 0,
  CTR: 0,
  averageCPC: 0,
  cost: 0,
  budget: 0
};
