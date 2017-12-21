import { Ad } from './ad.model';
import { CampaignBasicInformation } from './campaign-basic-information.model';

export interface Campaign {
  basicInformation: CampaignBasicInformation;

  id: number,
  clicks?: number;
  impressions?: number;
  ctr?: number;
  averageCPC?: number;
  cost?: number;
  conversions?: number;

  targeting?: {
    requires?: {
      languages?: string[];
      devices?: string[];
      genders?: string[];
      operatingSystems?: string[];
      browsers?: string[];
    },
    excludes?: {
      languages?: string[];
      devices?: string[];
      genders?: string[];
      operatingSystems?: string[];
      browsers?: string[];
    }
  };

  ads?: Ad[];
}
