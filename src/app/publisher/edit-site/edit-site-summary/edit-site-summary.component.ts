import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/first';

import { AppState } from 'models/app-state.model';
import { Site } from 'models/site.model';
import { siteStatusEnum } from 'models/enum/site.enum';
import { PublisherService } from 'publisher/publisher.service';
import { AssetHelpersService } from 'common/asset-helpers.service';
import { adUnitStatusesEnum } from 'models/enum/ad.enum';
import * as publisherActions from 'store/publisher/publisher.actions';
import { HandleSubscription } from 'common/handle-subscription';
import { TargetingOption } from 'models/targeting-option.model';
import { cloneDeep } from 'common/utilities/helpers';

@Component({
  selector: 'app-edit-site-summary',
  templateUrl: './edit-site-summary.component.html',
  styleUrls: ['./edit-site-summary.component.scss']
})
export class EditSiteSummaryComponent extends HandleSubscription implements OnInit {
  site: Site;
  targetingOptionsToAdd: TargetingOption[];
  targetingOptionsToExclude: TargetingOption[];

  constructor(
    private store: Store<AppState>,
    private publisherService: PublisherService,
    private assetHelpers: AssetHelpersService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    const lastSiteSubscription = this.store.select('state', 'publisher', 'lastEditedSite')
      .subscribe((site: Site) => {
        this.assetHelpers.redirectIfNameNotFilled(site);
        this.site = site;
      });
    this.subscriptions.push(lastSiteSubscription);

    this.targetingOptionsToAdd = cloneDeep(this.route.parent.snapshot.data.targetingOptions);
    this.targetingOptionsToExclude = cloneDeep(this.route.parent.snapshot.data.targetingOptions);
  }

  saveSite(isDraft) {
    this.store.dispatch(new publisherActions.ClearLastEditedSite({}));
    if (!isDraft) {
      this.site.status = siteStatusEnum.ACTIVE;
      this.site.adUnits.forEach(adUnit => adUnit.status = adUnitStatusesEnum.ACTIVE);
    }

    this.store.dispatch(new publisherActions.AddSiteToSites(this.site));
    this.router.navigate(['/publisher', 'dashboard']);
  }
}
