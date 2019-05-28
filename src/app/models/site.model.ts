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

  clicks?: number;
  impressions?: number;
  averageRpm?: number;
  averageRpc?: number;
  ctr?: number;
  revenue?: number;
  code?: string;
}

interface SitesTotals {
  averageRpm: number;
  clicks: number;
  ctr: number;
  impressions: number;
  revenue: number;
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
