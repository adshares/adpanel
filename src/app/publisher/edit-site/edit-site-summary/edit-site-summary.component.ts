import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/first';

import { AppState } from 'models/app-state.model';
import { Site } from 'models/site.model';
import { siteStatusEnum } from 'models/enum/site.enum';
import { PublisherService } from 'publisher/publisher.service';
import { AssetHelpersService } from 'common/asset-helpers.service';
import {AddSiteToSites} from 'store/publisher/publisher.actions';
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
  filteringOptions: TargetingOption[];
  canSubmit: boolean;

  constructor(
    private store: Store<AppState>,
    private publisherService: PublisherService,
    private assetHelpers: AssetHelpersService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    const lastSiteSubscription = this.store.select('state', 'publisher', 'lastEditedSite')
      .first()
      .subscribe((lastEditedSite: Site) => {
        this.filteringOptions = cloneDeep(this.route.parent.snapshot.data.filteringOptions);
        this.site =  lastEditedSite;
      });

    this.subscriptions.push(lastSiteSubscription);
    this.assetHelpers.redirectIfNameNotFilled(this.site);
  }

  saveSite(isDraft): void {
    this.canSubmit = false;
    if (!isDraft) {
      this.site.status = siteStatusEnum.ACTIVE;
    }
    this.store.dispatch(new AddSiteToSites(this.site));
  }
}
