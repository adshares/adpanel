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
  id?: number;
  name: string;
  budgetType: string;
  eventType: string;
  type: string;
  value?: string;
  limit?: string;
}

interface CampaignConversionItem {
  id?: number;
  name: string;
  eventType: string;
  isAdvanced: boolean;
  isInBudget: boolean;
  value?: string;
  limit?: string;
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
