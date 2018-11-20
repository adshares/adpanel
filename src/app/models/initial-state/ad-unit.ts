import { AdUnit } from 'models/site.model';
import { adTypesOptions, adUnitStatusesEnum } from 'models/enum/ad.enum';


export const adUnitInitialState: Partial<AdUnit> = {
  shortHeadline: '',
  type: adTypesOptions[0],
  status: adUnitStatusesEnum.DRAFT
}
