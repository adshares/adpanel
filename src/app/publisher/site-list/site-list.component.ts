import { Component, Input, SimpleChanges, ViewChild, OnChanges } from '@angular/core';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { Site, SitesTotals } from 'models/site.model';
import { enumToObjectArray, sortArrayByKeys } from 'common/utilities/helpers';
import { TableSortEvent } from 'models/table.model';
import { siteStatusEnum } from 'models/enum/site.enum';
import { TableNavigationComponent } from 'common/components/table-navigation/table-navigation.component';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.scss'],
})
export class SiteListComponent extends HandleSubscriptionComponent implements OnChanges {
  @Input() dataLoaded: boolean;
  @Input() sites: Site[];
  @Input() sitesTotals: SitesTotals;
  @ViewChild(TableNavigationComponent)
  tableNavigationRef: TableNavigationComponent;
  siteStatuses: any[];

  constructor() {
    super();

    this.siteStatuses = SiteListComponent.addLabelsToStatuses();
  }

  private static addLabelsToStatuses() {
    return enumToObjectArray(siteStatusEnum).map(item => {
      const name = item.name;
      let label;
      switch (name) {
        case 'active':
          label = 'Activate';
          break;
        case 'inactive':
          label = 'Deactivate';
          break;
        default:
          label = name.charAt(0).toUpperCase() + name.slice(1);
          break;
      }

      return {
        value: item.id,
        label: label,
      };
    });
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.tableNavigationRef) {
      this.tableNavigationRef.refresh();
    }
  }

  sortTable(event: TableSortEvent): void {
    this.sites = sortArrayByKeys(this.sites, event.keys, event.sortDesc);
  }
}
