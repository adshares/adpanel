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
  CTR?: number;
  averageCPC?: number;
  cost?: number;
  conversions?: number;
  classificationStatus: number;
  classificationTags?: string;
}

interface CampaignTotals {
  campaignId: number;
  totalBudget: number;
  clicks: number;
  impressions: number;
  ctr: number;
  averageCpc: number;
  cost: number;
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

interface Ad {
  id: number;
  status: number;
  name: string;
  type: number;
  size: number;
  clicks: number;
  impressions: number;
  ctr: number;
  averageCpc: number;
  cost: number;
  budget: number;

  imageUrl?: string;
  imageSize?: string;
  html?: string;
}

export { Campaign, CampaignBasicInformation, Ad, CampaignTotals };
