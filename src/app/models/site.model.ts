import { TargetingOptionValue } from './targeting-option.model';

export interface Site {
  id: number;
  name: string;
  websiteUrl: string;
  primaryLanguage: string;
  estimatedEarnings?: number;
  clicks?: number;
  impressions?: number;
  rpm?: number;
  averageCPC?: number;

  targeting?: {
    requires?: TargetingOptionValue[],
    excludes?: TargetingOptionValue[]
  };

  adUnits?: object[];
}
