import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../models/app-state.model';
import { Campaign } from '../../models/campaign.model';

import * as advertiserActions from '../../store/advertiser/advertiser.action';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss'],
})

export class CampaignListComponent implements OnInit {

  private subscription: Subscription;
  campaigns: Campaign[];

  constructor(private store: Store<AppState>) {
    this.subscription = store
      .select('state', 'advertiser', 'campaigns')
      .subscribe(campaigns => this.campaigns = campaigns);
  }

  ngOnInit() {
    this.store.dispatch(new advertiserActions.LoadCampaigns('campaigns'));
  }

}

