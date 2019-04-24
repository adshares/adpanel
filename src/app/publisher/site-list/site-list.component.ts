import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HandleSubscription } from 'common/handle-subscription';
import { Site, SitesTotals } from 'models/site.model';
import { sortArrayByColumnMetaData } from 'common/utilities/helpers';
import { TableColumnMetaData } from 'models/table.model';
import { environment } from "environments/environment";

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.scss']
})
export class SiteListComponent extends HandleSubscription {
  @Input() sites: Site[];
  @Input() sitesTotals: SitesTotals;
  currencySymbol = environment.currencySymbol;

  constructor(
    private router: Router,
  ) {
    super();
  }


  sortTable(columnMetaData: TableColumnMetaData) {
    this.sites = sortArrayByColumnMetaData(this.sites, columnMetaData);
  }

  navigateToCreateSite() {
    this.router.navigate(
      ['publisher', 'create-site', 'basic-information'],
      {queryParams: {step: 1}}
    );
  }
}
