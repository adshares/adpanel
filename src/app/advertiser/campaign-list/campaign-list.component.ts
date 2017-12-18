import { Component, OnInit } from '@angular/core';
import { HandleSubscription } from '../../common/handle-subscription';

import { Store } from '@ngrx/store';
import { AppState } from '../../models/app-state.model';
import { Campaign } from '../../models/campaign.model';

import * as advertiserActions from '../../store/advertiser/advertiser.action';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss'],
})

export class CampaignListComponent extends HandleSubscription implements OnInit {
  campaigns: Campaign[];

  constructor(private store: Store<AppState>) {
    super(null);

    const campaignsSubscription = store
      .select('state', 'advertiser', 'campaigns')
      .subscribe(campaigns => this.campaigns = campaigns);

    this.subscriptions.push(campaignsSubscription);
  }

  ngOnInit() {
    this.store.dispatch(new advertiserActions.LoadCampaigns('campaigns'));
  }

}
