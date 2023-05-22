import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

import { AppState } from 'models/app-state.model';
import { AdUnit, Site } from 'models/site.model';
import { siteStatusEnum } from 'models/enum/site.enum';
import { PUBLISHER_INSTRUCTION_LINK } from 'models/enum/link.enum';
import { PublisherService } from 'publisher/publisher.service';
import { AssetHelpersService } from 'common/asset-helpers.service';
import { AddSiteToSites } from 'store/publisher/publisher.actions';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { TargetingOption } from 'models/targeting-option.model';
import { cloneDeep } from 'common/utilities/helpers';
import { adUnitTypesEnum } from 'models/enum/ad.enum';
import { first } from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';
import { SHOW_DIALOG_ON_ERROR } from 'store/common/common.actions';

@Component({
  selector: 'app-edit-site-summary',
  templateUrl: './edit-site-summary.component.html',
  styleUrls: ['./edit-site-summary.component.scss'],
})
export class EditSiteSummaryComponent extends HandleSubscriptionComponent implements OnInit {
  site: Site;
  filteringOptions: TargetingOption[];
  changeSaved: boolean = false;
  displayAds: boolean;
  PUBLISHER_INSTRUCTION_LINK = PUBLISHER_INSTRUCTION_LINK;

  constructor(
    private store: Store<AppState>,
    private publisherService: PublisherService,
    private assetHelpers: AssetHelpersService,
    private router: Router,
    private route: ActivatedRoute,
    private actions: Actions
  ) {
    super();
  }

  ngOnInit() {
    const lastSiteSubscription = this.store
      .select('state', 'publisher', 'lastEditedSite')
      .pipe(first())
      .subscribe((lastEditedSite: Site) => {
        this.filteringOptions = cloneDeep(this.route.parent.snapshot.data.filteringOptions);
        this.site = lastEditedSite;
        this.displayAds = this.site.medium !== 'metaverse';
      });

    this.subscriptions.push(lastSiteSubscription);
    this.assetHelpers.redirectIfNameNotFilled(this.site);
  }

  get popAdUnits(): AdUnit[] {
    return this.site.adUnits.filter(adUnit => {
      return adUnit.type === adUnitTypesEnum.POP;
    });
  }

  get displayAdUnits(): AdUnit[] {
    return this.site.adUnits.filter(adUnit => {
      return adUnit.type === adUnitTypesEnum.DISPLAY;
    });
  }

  saveSite(isDraft): void {
    this.changeSaved = true;
    if (!isDraft) {
      this.site = {
        ...this.site,
        status: siteStatusEnum.ACTIVE,
      };
    }
    this.store.dispatch(new AddSiteToSites(this.site));
    const errorSubscription = this.actions.pipe(ofType(SHOW_DIALOG_ON_ERROR)).subscribe(() => {
      this.changeSaved = false;
    });
    this.subscriptions.push(errorSubscription);
  }
}
