import { Ad } from './ad.model';

interface Campaign {
  basicInformation: CampaignBasicInformation;
  targeting?: CampaignTargeting;
  ads?: Ad[];

  id: number,
  clicks?: number;
  impressions?: number;
  ctr?: number;
  averageCPC?: number;
  cost?: number;
  conversions?: number;
}

interface CampaignBasicInformation {
  status: string;
  name: string;
  targetUrl: string;
  bidStrategyName: string;
  bidValue: number;
  budget: number;
  dateStart: Object;
  dateEnd?: Object;
}

interface CampaignTargeting {
  requires?: {
    [key: string]: string[]
  },
  excludes?: {
    [key: string]: string[]
  }
}

export { Campaign, CampaignBasicInformation, CampaignTargeting }
