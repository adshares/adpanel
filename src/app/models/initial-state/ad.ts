import { Ad } from '../campaign.model';
import { adStatusesEnum, adTypesEnum, adSizesEnum } from '../enum/ad.enum';

export const adInitialState: Ad = {
  id: 0,
  status: adStatusesEnum.DRAFT,
  shortHeadline: '',
  type: adTypesEnum.IMAGE,
  size: adSizesEnum['728x90'],
  clicks: 0,
  impressions: 0,
  ctr: 0,
  averageCPC: 0,
  cost: 0,
  budget: 0
}
