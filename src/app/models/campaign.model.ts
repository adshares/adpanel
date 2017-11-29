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
  conversions: number;

  targeting?: {
    requires?: {
      languages?: string[];
      devices?: string[];
      genders?: string[];
      operatingSystems?: string[];
      browsers?: string[];
    },
    excludes?: {
      languages?: string[];
      devices?: string[];
      genders?: string[];
      operatingSystems?: string[];
      browsers?: string[];
    }
  };

  ads: Ad[];
}
