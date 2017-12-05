import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../models/app-state.model';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss'],
})

export class CampaignListComponent {
  private subscription;
  campaigns: Object;

  constructor(private store: Store<AppState>) {
    this.subscription = store
      .select('state', 'advertiser', 'campaigns')
      .subscribe(campaigns => {
        this.campaigns = campaigns;
      });
  }

}

