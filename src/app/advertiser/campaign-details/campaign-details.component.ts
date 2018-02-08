import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Campaign } from '../../models/campaign.model';
import { AppState } from '../../models/app-state.model';
import * as advertiserActions from '../../store/advertiser/advertiser.actions';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss']
})
export class CampaignDetailsComponent {
  campaign: Campaign;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.campaign = this.route.snapshot.data.campaign;
  }

  navigateToEditCampaign() {
    this.store.dispatch(new advertiserActions.SetLastEditedCampaign(this.campaign));
    this.router.navigate(
      ['/advertiser', 'create-campaign', 'summary'],
      { queryParams: { step: 4} }
    );
  }
}
