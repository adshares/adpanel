import {Component, Input} from '@angular/core';
import { Router } from '@angular/router';

import {Campaign, CampaignTotals} from 'models/campaign.model';
import { campaignStatusesEnum } from 'models/enum/campaign.enum';
import * as advertiserActions from "store/advertiser/advertiser.actions";
import {AppState} from "models/app-state.model";
import {Store} from "@ngrx/store";
import {ChartFilterSettings} from "models/chart/chart-filter-settings.model";

@Component({
  selector: 'app-campaign-list-item',
  templateUrl: './campaign-list-item.component.html',
  styleUrls: ['./campaign-list-item.component.scss'],
})
export class CampaignListItemComponent {
  @Input() campaign: Campaign;
  @Input() filterSettings: ChartFilterSettings;

  constructor(private router: Router, private store: Store<AppState>) {
  }
  campaignStatusesEnum = campaignStatusesEnum;

  navigateToCampaignDetails(campaignId: number) {
    this.store.dispatch(new advertiserActions.LoadCampaignBannerData({
      from: this.filterSettings.currentFrom,
      to: this.filterSettings.currentTo,
      id: this.campaign.id
    }));
    this.router.navigate(['/advertiser', 'campaign', campaignId]);
  }
}
