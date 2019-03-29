import { AssetTargeting } from './targeting-option.model';

interface Site {
  id?: number;
  status: number;
  name: string;
  primaryLanguage: string | SiteLanguage;
  requireClassified: boolean;
  excludeUnclassified: boolean;
  filtering: {
    requires: object;
    excludes: object;
  };
  filteringArray?: AssetTargeting;
  adUnits?: AdUnit[];

  estimatedEarnings?: number;
  clicks?: number;
  impressions?: number;
  averageRpm?: number;
  averageRpc?: number;
  ctr?: number;
  cost?: number;
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
  id?: number
  shortHeadline: string;
  type: string;
  size: AdUnitSize;
  status: number;
  code?: string;

  clicks?: number;
  impressions?: number;
  ctr?: number;
  averageRpc?: number;
  averageRpm?: number;
  revenue?: number;
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
