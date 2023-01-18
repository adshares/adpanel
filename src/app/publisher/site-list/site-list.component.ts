import { Component, Input, SimpleChanges, ViewChild, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { HandleSubscription } from 'common/handle-subscription';
import { Site, SitesTotals } from 'models/site.model';
import { enumToArray, sortArrayByKeys } from 'common/utilities/helpers';
import { TableSortEvent } from 'models/table.model';
import { siteStatusEnum } from 'models/enum/site.enum';
import { TableNavigationComponent } from 'common/components/table-navigation/table-navigation.component';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.scss'],
})
export class SiteListComponent extends HandleSubscription implements OnChanges {
  @Input() dataLoaded: boolean;
  @Input() sites: Site[];
  @Input() sitesTotals: SitesTotals;
  @ViewChild(TableNavigationComponent)
  tableNavigationRef: TableNavigationComponent;
  siteStatuses: any[];

  constructor(private router: Router) {
    super();

    this.siteStatuses = SiteListComponent.addLabelsToStatuses();
  }

  private static addLabelsToStatuses() {
    return enumToArray(siteStatusEnum).map(item => {
      let label;
      switch (item) {
        case 'active':
          label = 'Activate';
          break;
        case 'inactive':
          label = 'Deactivate';
          break;
        default:
          label = item;
          break;
      }

      return {
        value: item,
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

  navigateToCreateSite(): void {
    this.router.navigate(['publisher', 'create-site', 'basic-information']);
  }
}
