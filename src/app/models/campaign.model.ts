import { AssetTargeting } from './targeting-option.model';

interface Campaign {
  id: number;
  basicInformation: CampaignBasicInformation;

  targetingArray?: AssetTargeting;
  targeting?: {
    requires: object;
    excludes: object;
  };
  ads?: Ad[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  averageCPC?: number;
  cost?: number;
  conversions?: number;
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
  ctr: number;
  averageCPC: number;
  cost: number;
  budget: number;

  imageUrl?: string;
  imageSize?: string;
  html?: string;
}

export { Campaign, CampaignBasicInformation, Ad }
