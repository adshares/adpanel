import { AdUnit } from 'models/site.model';
import { adUnitTypesEnum, adUnitStatusesEnum } from 'models/enum/ad.enum';

export const adUnitInitialState: Partial<AdUnit> = {
  name: '',
  type: adUnitTypesEnum.DISPLAY,
  status: adUnitStatusesEnum.ACTIVE,
};
