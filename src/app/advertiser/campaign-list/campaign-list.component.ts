import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';

import {AppState} from 'models/app-state.model';
import {Campaign, CampaignTotals} from 'models/campaign.model';
import {sortArrayByColumnMetaData} from 'common/utilities/helpers';
import {TableColumnMetaData} from 'models/table.model';
import {HandleSubscription} from "common/handle-subscription";
import {ChartFilterSettings} from "models/chart/chart-filter-settings.model";

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})

export class CampaignListComponent extends HandleSubscription implements OnInit {
  @Input() campaigns: Campaign[];
  @Input() filterSettings: ChartFilterSettings[];
  campaignsTotals: CampaignTotals[];

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit() {
    const campaignsTotalsSubscription = this.store.select('state', 'advertiser', 'campaignsTotals')
      .subscribe((campaignsTotals: CampaignTotals[]) => {
        this.campaignsTotals = campaignsTotals;
      });

    this.subscriptions.push(campaignsTotalsSubscription);
  }

  getCampaignTotals = (id): CampaignTotals => {
    return this.campaignsTotals.find(campaign => id === campaign.campaignId);
  };

  sortTable(columnMetaData: TableColumnMetaData) {
    this.campaigns = sortArrayByColumnMetaData(this.campaigns, columnMetaData);
  }

  navigateToCreateCampaign() {
    this.router.navigate(
      ['advertiser', 'create-campaign', 'basic-information'],
      {queryParams: {step: 1}}
    );
  }
}
