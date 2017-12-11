import { Component, OnInit } from '@angular/core';
import { AdvertiserService } from '../../store/advertiser/advertiser.service';
import { Subscription } from 'rxjs/Subscription';

import { Store } from '@ngrx/store';
import { AppState } from '../../models/app-state.model';
import * as advertiserActions from '../../store/advertiser/advertiser.action';

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
  campaigns: Object;

  constructor(
    private store: Store<AppState>
  ) {
    this.subscription = store
      .select('state', 'advertiser', 'campaigns')
      .subscribe(campaigns => this.campaigns = campaigns);
  }

  ngOnInit() {
    this.store.dispatch(new advertiserActions.LoadCampaigns('campaigns'));
  }

}

