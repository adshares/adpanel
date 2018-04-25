import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppState } from 'models/app-state.model';
import { Campaign, CampaignsTotals } from 'models/campaign.model';
import { sortArrayByColumnMetaData } from 'common/utilities/helpers';
import { TableColumnMetaData } from 'models/table.model';
import * as advertiserActions from 'store/advertiser/advertiser.actions';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})

export class CampaignListComponent {
  @Input() campaigns: Campaign[];
  @Input() campaignsTotals: CampaignsTotals;

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {}

  sortTable(columnMetaData: TableColumnMetaData) {
    this.campaigns = sortArrayByColumnMetaData(this.campaigns, columnMetaData);
  }

  navigateToCreateCampaign() {
    this.store.dispatch(new advertiserActions.ClearLastEditedCampaign(''));

    this.router.navigate(
      [ 'advertiser', 'create-campaign', 'basic-information'],
      { queryParams: { step: 1 } }
    );
  }
}
