import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import 'rxjs/add/operator/take';

import { AppState } from 'models/app-state.model';
import { Site } from 'models/site.model';
import { siteStatusEnum } from 'models/enum/site.enum';
import { PublisherService } from 'publisher/publisher.service';
import { adUnitStatusesEnum } from 'models/enum/ad.enum';
import * as publisherActions from 'store/publisher/publisher.actions';

@Component({
  selector: 'app-edit-site-summary',
  templateUrl: './edit-site-summary.component.html',
  styleUrls: ['./edit-site-summary.component.scss']
})
export class EditSiteSummaryComponent implements OnInit {
  site: Site;

  constructor(
    private store: Store<AppState>,
    private publisherService: PublisherService,
    private router: Router
  ) { }

  ngOnInit() {
    this.store.select('state', 'publisher', 'lastEditedSite')
      .subscribe((site: Site) => this.site = site);
  }

  saveSite(isDraft) {
    if (!isDraft) {
      this.site.status = siteStatusEnum.ACTIVE;
      this.site.adUnits.forEach((adUnit) => adUnit.status = adUnitStatusesEnum.ACTIVE);
    }

    this.publisherService.saveSite(this.site)
      .take(1)
      .subscribe(() => {
        this.store.dispatch(new publisherActions.AddSiteToSites(this.site));
        this.router.navigate(['/publisher', 'dashboard']);
      });
  }
}
