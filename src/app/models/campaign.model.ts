import { Ad } from "./ad.model";

export interface Campaign {
  status: string;
  name: string;
  targetUrl: string;
  bidStrategyName: string;
  bidStrategyValue: number;
  budget: number;
  dateStart: Object;
  dateEnd?: Object;

  clicks: number;
  impressions: number;
  ctr: number;
  averageCPC: number;
  cost: number;

  targeting?: {
    requires?: {
      language?: Array<string>;
      device?: Array<string>;
      gender?: Array<string>;
      operatingSystem?: Array<string>;
      browser?: Array<string>;
    },
    excludes?: {
      language?: Array<string>;
      device?: Array<string>;
      gender?: Array<string>;
      operatingSystem?: Array<string>;
      browser?: Array<string>;
    }
  };

  ads: Array<Ad>
}
