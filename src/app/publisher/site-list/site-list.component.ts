import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HandleSubscription } from 'common/handle-subscription';
import { Site, SitesTotals } from 'models/site.model';
import { enumToArray, sortArrayByKeys } from 'common/utilities/helpers';
import { TableSortEvent } from 'models/table.model';
import { siteStatusEnum } from 'models/enum/site.enum';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.scss']
})
export class SiteListComponent extends HandleSubscription {
  @Input() sites: Site[];
  @Input() sitesTotals: SitesTotals;
  siteStatuses: any[];

  constructor(
    private router: Router,
  ) {
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

  sortTable(event: TableSortEvent) {
    this.sites = sortArrayByKeys(this.sites, event.keys, event.sortDesc);
  }

  navigateToCreateSite() {
    this.router.navigate(
      ['publisher', 'create-site', 'basic-information'],
      {queryParams: {step: 1}}
    );
  }
}
