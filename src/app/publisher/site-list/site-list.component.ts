import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { HandleSubscription } from 'common/handle-subscription';
import { AppState } from 'models/app-state.model';
import { Site, SitesTotals } from 'models/site.model';
import { sortArrayByColumnMetaData } from 'common/utilities/helpers';
import { TableColumnMetaData } from 'models/table.model';
import * as publisherActions from 'store/publisher/publisher.actions';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.scss']
})
export class SiteListComponent extends HandleSubscription {
  @Input() sites: Site[];
  @Input() sitesTotals: SitesTotals;

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    super();
  }


  sortTable(columnMetaData: TableColumnMetaData) {
    this.sites = sortArrayByColumnMetaData(this.sites, columnMetaData);
  }

  navigateToCreateSite() {
    this.router.navigate(
      [ 'publisher', 'create-site', 'basic-information'],
      { queryParams: { step: 1 } }
    );
  }
}
