import { AdUnit } from 'models/site.model';
import { adUnitStatusesEnum, adTypesEnum } from 'models/enum/ad.enum';


export const adUnitInitialState: Partial<AdUnit> = {
  shortHeadline: '',
  type: adTypesEnum.IMAGE,
  status: adUnitStatusesEnum.DRAFT
}
