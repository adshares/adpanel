import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Campaign, CampaignTotals } from 'models/campaign.model';
import { sortArrayByKeys } from 'common/utilities/helpers';
import { TableSortEvent } from 'models/table.model';
import { TableNavigationComponent } from 'common/components/table-navigation/table-navigation.component';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss'],
})
export class CampaignListComponent {
  @Input() dataLoaded: boolean;
  @Input() campaigns: Campaign[];
  @Input() campaignsTotals: CampaignTotals;
  @ViewChild(TableNavigationComponent)
  tableNavigationRef: TableNavigationComponent;

  constructor(private router: Router) {}

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.tableNavigationRef) {
      this.tableNavigationRef.refresh();
    }
  }

  sortTable(event: TableSortEvent): void {
    this.campaigns = sortArrayByKeys(
      this.campaigns,
      event.keys,
      event.sortDesc
    );
  }

  navigateToCreateCampaign(): void {
    this.router.navigate([
      'advertiser',
      'create-campaign',
      'basic-information',
    ]);
  }
}
