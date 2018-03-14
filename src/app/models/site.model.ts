import { AssetTargeting } from './targeting-option.model';

interface Site {
  id: number;
  status: number;
  websiteUrl: string;
  primaryLanguage: number;

  estimatedEarnings?: number;
  clicks?: number;
  impressions?: number;
  rpm?: number;
  averageCPC?: number;
  targetingArray?: AssetTargeting;
  targeting?: {
    requires: object;
    excludes: object;
  };
  adUnits?: AdUnit[];
}

interface AdUnit {
  shortHeadline: string;
  type: number;
  size: AdUnitSize;
  status: number,

  code?: string;
  budget?: number;
  clicks?: number;
  impressions?: number;
  ctr?: number;
  averageCPC?: number;
  cost?: number;
}

interface AdUnitSize {
  id: number;
  name: string;
  size: number;
  tags: string[];

  selected?: boolean;
}

export { Site, AdUnit, AdUnitSize };
