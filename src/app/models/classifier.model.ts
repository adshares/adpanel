interface BannerClassification {
  bannerId: number;
  url: string;
  size: string;
  type: string;
  sourceHost: string;
  landingUrl: string;
  budget?: number;
  cpm?: number;
  cpc?: number;
  classifiedGlobal?: boolean;
  classifiedSite?: boolean;
}

interface BannerClassificationResponse {
  limit: number;
  offset: number;
  itemsCount: number;
  itemsCountAll: number;
  items: BannerClassification[];
}

interface BannerClassificationStatus {
  approved?: number;
  rejected?: number;
  unclassified?: number;
}

interface BannerClassificationFilters {
  status?: BannerClassificationStatus;
  sizes?: Array<string>;
  bannerId?: string;
  landingUrl?: string;
  classifierLocalBanners?: number;
}

export { BannerClassification, BannerClassificationResponse, BannerClassificationFilters };
