import { Component, OnInit } from '@angular/core';
import { HandleSubscription } from '../../common/handle-subscription';
import { AdvertiserService } from '../advertiser.service';

import { Campaign } from '../../models/campaign.model';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss'],
})
export class CampaignDetailsComponent extends HandleSubscription implements OnInit {
  campaign: Campaign;

  constructor(
    private advertiserService: AdvertiserService
  ) {
    super(null);
  }

  ngOnInit() {
    const campaignSubscription = this.advertiserService.getCampaign().subscribe(campaign => this.campaign = campaign);

    this.subscriptions.push(campaignSubscription);
  }
}
