import { Component, OnInit } from '@angular/core';
import { AdvertiserService } from '../../store/advertiser/advertiser.service';

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
  menuItems = [
    { title: 'Status', columnWidth: 'col-xs-1' },
    { title: 'Campaign Title', columnWidth: 'col-xs-4' },
    { title: 'Budget', columnWidth: 'col-xs-1' },
    { title: 'Clicks', columnWidth: 'col-xs-1' },
    { title: 'Impressions', columnWidth: 'col-xs-1' },
    { title: 'CTR', columnWidth: 'col-xs-1' },
    { title: 'Average CPC', columnWidth: 'col-xs-1' },
    { title: 'Cost', columnWidth: 'col-xs-1' },
  ];

  private subscription: Subscription;
  campaigns: Campaign[];

  constructor(
    private store: Store<AppState>
  ) {
    this.subscription = store
      .select('state', 'advertiser', 'campaigns')
      .subscribe(campaigns => {
        this.campaigns = campaigns;
      });
  }

  ngOnInit() {
    // this.advertiserService.getCampaigns()
    //   .subscribe(campaigns => {
    //     this.campaigns = campaigns.campaigns;
    //   })
    this.store.dispatch(new advertiserActions.LoadCampaigns('campaigns'));
  }

}

