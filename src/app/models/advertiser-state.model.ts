import { Campaign } from './campaign.model';

export interface AdvertiserState {
  lastEditedCampaign: Campaign;
  campaigns: Campaign[];
}
