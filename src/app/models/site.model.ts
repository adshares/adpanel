import { TargetingOptionValue } from './targeting-option.model';

interface Site {
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

  adUnits?: AdUnit[];
}

interface AdUnit {
  shortHeadline: string;
  type: number;
  size: AdUnitSize;
}

interface AdUnitSize {
  name: string;
  size: number;
  tags: string[];
  recommended?: boolean;
  selected?: boolean;
}

export { Site, AdUnit, AdUnitSize }
