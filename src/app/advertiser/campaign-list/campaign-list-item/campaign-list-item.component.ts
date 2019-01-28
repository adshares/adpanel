import {Component, Input} from '@angular/core';
import { Router } from '@angular/router';

import {Campaign, CampaignTotals} from 'models/campaign.model';
import { campaignStatusesEnum } from 'models/enum/campaign.enum';
import {ChartFilterSettings} from "models/chart/chart-filter-settings.model";

@Component({
  selector: 'app-campaign-list-item',
  templateUrl: './campaign-list-item.component.html',
  styleUrls: ['./campaign-list-item.component.scss'],
})
export class CampaignListItemComponent {
  @Input() campaign: Campaign;
  @Input() campaignTotals: CampaignTotals;
  @Input() filterSettings: ChartFilterSettings;
  campaignStatusesEnum = campaignStatusesEnum;

  constructor(private router: Router) {
  }
  navigateToCampaignDetails(campaignId: number) {
    this.router.navigate(['/advertiser', 'campaign', campaignId]);
  }
}
