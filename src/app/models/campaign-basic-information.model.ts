export interface CampaignBasicInformation {
  id: number;
  status: string;
  name: string;
  targetUrl: string;
  bidStrategyName: string;
  bidValue: number;
  budget: number;
  dateStart: Object;
  dateEnd?: Object;
}
