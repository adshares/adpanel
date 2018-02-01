import { AssetTargeting } from './targeting-option.model';

interface Site {
  id: number;
  status: number;
  websiteUrl: string;
  primaryLanguage: string;

  estimatedEarnings?: number;
  clicks?: number;
  impressions?: number;
  rpm?: number;
  averageCPC?: number;
  targeting?: AssetTargeting;

  adUnits?: AdUnit[];
}

interface AdUnit {
  shortHeadline: string;
  type: number;
  size: AdUnitSize;

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

export { Site, AdUnit, AdUnitSize }
