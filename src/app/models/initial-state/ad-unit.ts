import { AdUnit } from '../site.model';
import { adUnitStatusesEnum, adTypesEnum } from '../enum/ad.enum';


export const adUnitInitialState: Partial<AdUnit> = {
  shortHeadline: '',
  type: adTypesEnum.IMAGE,
  status: adUnitStatusesEnum.DRAFT
}
