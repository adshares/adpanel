import { AssetTargeting } from './targeting-option.model';

interface Campaign {
  id?: number;
  basicInformation: CampaignBasicInformation;
  targeting: {
    requires: object;
    excludes: object;
  };
  ads: Ad[];

  targetingArray?: AssetTargeting;
  clicks?: number;
  impressions?: number;
  ctr?: number;
  averageCpc?: number;
  averageCpm?: number;
  cost?: number;
  conversions?: CampaignConversion[];
  secret: string;
  conversionClick: number;
  conversionClickLink?: string;
  classificationStatus: number;
  classificationTags?: string;
}

interface CampaignTotals {
  clicks: number;
  impressions: number;
  ctr: number;
  averageCpc: number;
  averageCpm: number;
  cost: number;
  bannerId?: number;
  bannerName?: number;
}

interface CampaignBasicInformation {
  status: number;
  name: string;
  targetUrl: string;
  maxCpc: number;
  maxCpm: number;
  budget: number;
  dateStart: string;
  dateEnd?: string;
}

interface CampaignConversion {
  uuid?: string;
  name: string;
  budgetType: string;
  eventType: string;
  type: string;
  value?: number;
  limit?: number;
  link?: string;
  isValueMutable?: number;
  isRepeatable?: number;
  cost: number;
  occurrences: number;
}

interface CampaignConversionItem {
  uuid?: string;
  name: string;
  eventType: string;
  isAdvanced: boolean;
  isInBudget: boolean;
  value?: string;
  limit?: string;
  link?: string;
  isValueMutable?: boolean;
  isRepeatable?: boolean;
}

interface Ad {
  id: number;
  status: number;
  name: string;
  type: number;
  size: number;
  clicks: number;
  impressions: number;
  ctr: number;
  averageCpm: number;
  averageCpc: number;
  cost: number;
  budget: number;
  url: string;

  imageSize?: string;
}

interface CampaignTotalsResponse {
  total: CampaignTotals,
  data: CampaignTotals[]
}


export {
  Campaign,
  CampaignBasicInformation,
  CampaignConversion,
  CampaignConversionItem,
  Ad,
  CampaignTotals,
  CampaignTotalsResponse
};
