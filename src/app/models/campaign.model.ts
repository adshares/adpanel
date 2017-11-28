import { Ad } from './ad.model';

export interface Campaign {
  id: number;
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
      languages?: Array<string>;
      devices?: Array<string>;
      genders?: Array<string>;
      operatingSystems?: Array<string>;
      browsers?: Array<string>;
    },
    excludes?: {
      languages?: Array<string>;
      devices?: Array<string>;
      genders?: Array<string>;
      operatingSystems?: Array<string>;
      browsers?: Array<string>;
    }
  };

  ads: Array<Ad>;
}
