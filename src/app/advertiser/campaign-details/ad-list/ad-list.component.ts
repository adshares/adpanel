import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import { Ad, Campaign } from 'models/campaign.model';
import { sortArrayByKeys } from 'common/utilities/helpers';
import { TableSortEvent } from 'models/table.model';
import { TableNavigationComponent } from 'common/components/table-navigation/table-navigation.component';

@Component({
  selector: 'app-poster-list',
  templateUrl: './ad-list.component.html',
  styleUrls: ['./ad-list.component.scss'],
})
export class AdListComponent implements OnChanges {
  @Input() adList: Ad[];
  @Input() campaign: Campaign;
  @ViewChild(TableNavigationComponent)
  tableNavigationRef: TableNavigationComponent;

  ngOnChanges(_changes: SimpleChanges) {
    if (this.tableNavigationRef) {
      this.tableNavigationRef.refresh();
    }
  }

  sortTable(event: TableSortEvent) {
    this.adList = sortArrayByKeys(this.campaign.ads, event.keys, event.sortDesc);
  }
}
