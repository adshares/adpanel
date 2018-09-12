import { AssetTargeting } from './targeting-option.model';

interface Campaign {
  id?: number;
  basicInformation: CampaignBasicInformation;
  targeting: {
    requires: object;
    excludes: object;
  };

  targetingArray?: AssetTargeting;
  ads: Ad[];
  clicks?: number;
  impressions?: number;
  CTR?: number;
  averageCPC?: number;
  cost?: number;
  conversions?: number;
}

interface CampaignsTotals {
  totalBudget: number;
  totalClicks: number;
  totalImpressions: number;
  averageCTR: number;
  averageCPC: number;
  totalCost: number;
}

interface CampaignBasicInformation {
  status: number;
  name: string;
  targetUrl: string;
  bidStrategyName: string;
  bidValue: number;
  budget: number;
  dateStart: string;

  dateEnd?: string;
}

interface Ad {
  id: number;
  status: number;
  shortHeadline: string;
  type: number;
  size: number;
  clicks: number;
  impressions: number;
  CTR: number;
  averageCPC: number;
  cost: number;
  budget: number;

  imageUrl?: string;
  imageSize?: string;
  html?: string;
}

export { Campaign, CampaignBasicInformation, Ad, CampaignsTotals };
