import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';

import {Campaign, CampaignTotals} from 'models/campaign.model';
import {sortArrayByColumnMetaData} from 'common/utilities/helpers';
import {TableColumnMetaData} from 'models/table.model';
import {ChartFilterSettings} from "models/chart/chart-filter-settings.model";
import { DOLLAR_SYMBOL } from "common/utilities/consts";

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})

export class CampaignListComponent {
  @Input() campaigns: Campaign[];
  @Input() campaignsTotals: CampaignTotals;
  @Input() filterSettings: ChartFilterSettings[];
  DOLLAR_SYMBOL = DOLLAR_SYMBOL;

  constructor(
    private router: Router,
  ) {}


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
