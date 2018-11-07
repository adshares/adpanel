import { AdUnit } from 'models/site.model';
import { adTypesEnum, adUnitStatusesEnum } from 'models/enum/ad.enum';


export const adUnitInitialState: Partial<AdUnit> = {
  shortHeadline: '',
  type: adTypesEnum.IMAGE,
  status: adUnitStatusesEnum.DRAFT
}
