import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { HandleSubscription } from '../../common/handle-subscription';
import { AppState } from '../../models/app-state.model';
import { Campaign } from '../../models/campaign.model';

import * as advertiserActions from '../../store/advertiser/advertiser.actions';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})

export class CampaignListComponent extends HandleSubscription implements OnInit {
  campaigns: Store<Campaign[]>;

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    super(null);
  }

  ngOnInit() {
    this.store.dispatch(new advertiserActions.LoadCampaigns(''));
    this.campaigns = this.store.select('state', 'advertiser', 'campaigns');
  }

  navigateToCreateCampaign() {
    this.store.dispatch(new advertiserActions.ClearLastEditedCampaign(''));

    this.router.navigate(
      [ 'advertiser', 'create-campaign', 'basic-information'],
      { queryParams: { step: 1 } }
    );
  }
}
