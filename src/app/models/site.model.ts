import { AssetTargeting } from './targeting-option.model';

interface Site {
  id?: number;
  status: number;
  name: string;
  domain: string;
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
  averageRpc?: number;
  averageRpm: number;
  clicks: number;
  ctr: number;
  impressions: number;
  revenue: number;
}

interface AdUnit {
  id?: number;
  name: string;
  type: string;
  size: string;
  label: string;
  tags: string[];
  status: number;
  code?: string;

  clicks?: number;
  impressions?: number;
  ctr?: number;
  averageRpc?: number;
  averageRpm?: number;
  revenue?: number;
}

interface AdUnitMetaData {
  label: string;
  size: string;
  tags: string[];
  type: string;
}

interface SiteLanguage {
  name: string,
  code: string,
}


export { Site, AdUnit, AdUnitMetaData, SitesTotals, SiteLanguage };
