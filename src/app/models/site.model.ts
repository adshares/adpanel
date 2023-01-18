import { AssetTargeting } from './targeting-option.model';

interface Site {
  id?: number;
  status: number;
  name: string;
  domain: string;
  url: string;
  primaryLanguage: string | SiteLanguage;
  medium: string;
  vendor: string | null;
  onlyAcceptedBanners: boolean;
  filtering: {
    requires: object;
    excludes: object;
  };
  filteringArray?: AssetTargeting;
  adUnits?: AdUnit[];
  categories?: string[];

  clicks?: number;
  impressions?: number;
  averageRpm?: number;
  averageRpc?: number;
  ctr?: number;
  revenue?: number;
  code?: string;
  rejectReason?: string | null;
}

interface SiteRank {
  rank: number;
  info: string;
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
  uuid?: string;
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
  name: string;
  code: string;
}

interface SiteCodes {
  common: string;
  pops: SiteCodeItem[];
  adUnits: SiteCodeItem[];
}

interface SiteCodeItem {
  label: string;
  code: string;
}

export { Site, SiteRank, AdUnit, AdUnitMetaData, SitesTotals, SiteLanguage, SiteCodes, SiteCodeItem };
