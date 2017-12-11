import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Store } from '@ngrx/store';
import { AppState } from '../../models/app-state.model';
import { Campaign } from '../../models/campaign.model';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss'],
})
export class CampaignDetailsComponent implements OnInit {
  campaigns: Campaign[];
  campaign: Object;
  campaignId: number;
  private subscription: Subscription;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute
  ) {
    this.subscription = store
      .select('state', 'advertiser', 'campaigns')
      .subscribe(campaigns => {
        this.campaigns = campaigns;
      });
    this.campaignId = +this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.campaign = this.campaigns.find(campaign => campaign.id === this.campaignId);
  }
}
