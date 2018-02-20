import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { HandleSubscription } from '../../common/handle-subscription';
import { AppState } from '../../models/app-state.model';
import { Campaign } from '../../models/campaign.model';
import { sortArrayByColumnMetaData } from '../../common/utilities/helpers';

import * as advertiserActions from '../../store/advertiser/advertiser.actions';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})

export class CampaignListComponent extends HandleSubscription implements OnInit {
  campaigns: Campaign[];

  sortTable = sortArrayByColumnMetaData;

  constructor(private store: Store<AppState>) {
    super(null);
  }

  ngOnInit() {
    this.store.dispatch(new advertiserActions.LoadCampaigns(''));
    const campaignsSubscription = this.store.select('state', 'advertiser', 'campaigns')
      .subscribe((capmaigns: Campaign[]) => this.campaigns = capmaigns);
    this.subscriptions.push(campaignsSubscription);
  }
}
