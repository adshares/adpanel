import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Campaign } from '../../models/campaign.model';
import { AppState } from '../../models/app-state.model';
import { AdvertiserService } from '../advertiser.service';
import { campaignStatusesEnum } from '../../models/enum/campaign.enum';
import { enumToObjectArray, selectCompare } from '../../common/utilities/helpers';

import * as advertiserActions from '../../store/advertiser/advertiser.actions';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss']
})
export class CampaignDetailsComponent {
  campaign: Campaign;

  campaignStatuses = enumToObjectArray(campaignStatusesEnum);
  selectCompare = selectCompare;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private advertiserService: AdvertiserService
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

  navigateToCreateAd() {
    this.store.dispatch(new advertiserActions.SetLastEditedCampaign(this.campaign));
    this.router.navigate(
      ['/advertiser', 'create-campaign', 'create-ad'],
      { queryParams: { step: 3, summary: true} }
    );
  }

  saveCampaign() {
    this.advertiserService.saveCampaign(this.campaign).subscribe();
  }
}
