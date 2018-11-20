import { AssetTargeting } from './targeting-option.model';

interface Site {
  id?: number;
  status: number;
  name: string;
  primaryLanguage: string | SiteLanguage;
  estimatedEarnings?: number;
  clicks?: number;
  impressions?: number;
  RPM?: number;
  averageCPC?: number;
  filtering?: AssetTargeting;

  adUnits?: AdUnit[];
  code?: string;
}

interface SitesTotals {
  totalEarnings: number;
  totalClicks: number;
  totalImpressions: number;
  averagePageRPM: number;
  averageCPC: number;
}

interface AdUnit {
  shortHeadline: string;
  type: string;
  size: AdUnitSize;
  status: number;

  code?: string;
  budget?: number;
  clicks?: number;
  impressions?: number;
  CTR?: number;
  averageCPC?: number;
  cost?: number;
}

interface AdUnitSize {
  size: number;
  tags: string[];
  label: string;
  selected?: boolean;
  id?: number;
  name?: string;
}

interface SiteLanguage {
  name: string,
  code: string,
}


export { Site, AdUnit, AdUnitSize, SitesTotals, SiteLanguage };
