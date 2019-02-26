interface BannerClassification {
  bannerId: number;
  url: string,
  type: string,
  width: number,
  height: number,
  sourceHost: string;
  budget?: number;
  cpm?: number;
  cpc?: number;
  classifiedGlobal?: boolean;
  classifiedSite?: boolean;
}

export { BannerClassification };
