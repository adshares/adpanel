import { AssetTargeting } from './targeting-option.model';

interface CampaignsConfig {
  minBudget: number;
  minCpm: number;
  minCpa: number;
}

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
  classifications: CampaignClassification[];
  bidStrategy?: CampaignBidStrategy;
}

interface CampaignBidStrategy {
  name: string;
  uuid: string;
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
  limitType: string;
  eventType: string;
  type: string;
  value?: number;
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
  link?: string;
  isValueMutable?: boolean;
  isRepeatable?: boolean;
}

interface CampaignConversionStatisticsTableItem {
  name: string;
  eventType: string;
  cost: number;
  occurrences: number;
}

interface CampaignConversionStatistics {
  campaignId: number;
  uuid: string;
  name: string;
  eventType: string;
  cost: number;
  occurrences: number;
}

interface CampaignClassification {
  classifier: string;
  status: number;
  keywords: any[];
}

interface Ad {
  id: number;
  status: number;
  name: string;
  type: number;
  creativeSize: string;
  creativeContents?: string;
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

interface AdPreview {
  isHtml: boolean;
  size: string;
  url: string;
  landingUrl: string;
}

interface CampaignTotalsResponse {
  total: CampaignTotals,
  data: CampaignTotals[]
}

interface BidStrategy {
  uuid: string,
  name: string,
  details: BidStrategyDetail[],
}

interface BidStrategyDetail {
  category: string,
  rank: number,
}

interface BidStrategyRequest {
  name: string,
  details: BidStrategyDetail[],
}

interface BidStrategyUuidDefaultResponse {
  uuid: string;
}

export {
  CampaignsConfig,
  Campaign,
  CampaignBasicInformation,
  CampaignConversion,
  CampaignConversionItem,
  CampaignConversionStatistics,
  CampaignConversionStatisticsTableItem,
  CampaignClassification,
  Ad,
  AdPreview,
  CampaignTotals,
  CampaignTotalsResponse,
  BidStrategy,
  BidStrategyDetail,
  BidStrategyRequest,
  BidStrategyUuidDefaultResponse,
};
