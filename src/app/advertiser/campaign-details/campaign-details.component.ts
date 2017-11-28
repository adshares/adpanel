import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss'],
})
export class CampaignDetailsComponent implements OnInit {
  campaigns: Object;
  campaign: Object;
  campaignId: number;
  private subscription;
  private subscription1;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.subscription = store
      .select('appStore', 'campaigns')
      .subscribe(campaigns => {
        this.campaigns = campaigns;
      });
    this.subscription1 = this.route.paramMap.subscribe(route => {
      this.campaignId = +route.params.id
    })
  }

  ngOnInit() {
    this.campaign = this.campaigns.find(x => x.id === this.campaignId);
  }
}
