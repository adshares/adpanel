import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppState } from '../../models/app-state.model';
import { Site } from '../../models/site.model';
import { PublisherService } from '../publisher.service';
import { enumToObjectArray, selectCompare } from '../../common/utilities/helpers';
import { siteStatusEnum } from '../../models/enum/site.enum';
import * as publisherActions from '../../store/publisher/publisher.actions';

@Component({
  selector: 'app-site-details',
  templateUrl: './site-details.component.html',
  styleUrls: ['./site-details.component.scss'],
})
export class SiteDetailsComponent {
  site: Site;

  siteStatuses = enumToObjectArray(siteStatusEnum);
  selectCompare = selectCompare;

  constructor(
    private route: ActivatedRoute,
    private publisherService: PublisherService,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.site = this.route.snapshot.data.site;
    console.log(this.site);
  }

  navigateToEditSite() {
    this.store.dispatch(new publisherActions.SetLastEditedSite(this.site));
    this.router.navigate(
      ['/publisher', 'create-site', 'summary'],
      { queryParams: { step: 4} }
    );
  }

  saveSite() {
    this.publisherService.saveSite(this.site).subscribe();
  }
}
