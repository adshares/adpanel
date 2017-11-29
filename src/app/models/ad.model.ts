export interface Ad {
  status: string;
  shortHeadline: string;
  type: string;
  imageDimensions?: string;
  imageSize?: number;

  clicks: number;
  impressions: number;
  ctr: number;
  averageCPC: number;
  cost: number;
  budget: number;
}
