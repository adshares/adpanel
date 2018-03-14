import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import * as publisherActions from 'store/publisher/publisher.actions';
import { AppState } from 'models/app-state.model';
import { TargetingOption, TargetingOptionValue } from 'models/targeting-option.model';
import { cloneDeep } from 'common/utilities/helpers';
import { HandleLeaveEditProcess } from 'common/handle-leave-edit-process';
import { PublisherService } from 'publisher/publisher.service';
import { Site } from 'models/site.model';
import { AssetTargeting } from 'models/targeting-option.model';
import { TargetingSelectComponent } from 'common/components/targeting/targeting-select/targeting-select.component';

@Component({
  selector: 'app-edit-site-additional-targeting',
  templateUrl: './edit-site-additional-targeting.component.html',
  styleUrls: ['./edit-site-additional-targeting.component.scss']
})
export class EditSiteAdditionalTargetingComponent extends HandleLeaveEditProcess implements OnInit {
  @ViewChild(TargetingSelectComponent) targetingSelectComponent: TargetingSelectComponent;

  goesToSummary: boolean;

  targetingOptionsToAdd: TargetingOption[];
  targetingOptionsToExclude: TargetingOption[];
  addedItems: TargetingOptionValue[] = [];
  excludedItems: TargetingOptionValue[] = [];

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router,
    private publisherService: PublisherService
  ) {
    super();
  }

  ngOnInit() {
    this.targetingOptionsToAdd = cloneDeep(this.route.parent.snapshot.data.targetingOptions);
    this.targetingOptionsToExclude = cloneDeep(this.route.parent.snapshot.data.targetingOptions);
    this.route.queryParams.subscribe(params => this.goesToSummary = !!params.summary);


    this.getSiteFromStore();

  }

  updateAddedItems(items) {
    this.addedItems = [...items];
  }

  updateExcludedItems(items) {
    this.excludedItems = [...items];
  }

  saveSite(isDraft) {
    const choosedTargeting = {
      requires: this.addedItems,
      excludes: this.excludedItems
    };

    this.changesSaved = true;

    this.store.dispatch(new publisherActions.SaveSiteTargeting(choosedTargeting));

    if (!isDraft) {
      const editSiteStep = this.goesToSummary ? 'summary' : 'create-ad-units';
      const param = this.goesToSummary ? 4 : 3;

      this.router.navigate(
        ['/publisher', 'create-site', editSiteStep],
        { queryParams: { step: param } }
      );
    } else {
      this.store.select('state', 'publisher', 'lastEditedSite')
        .take(1)
        .subscribe((lastEditedSite: Site) => {
          this.publisherService.saveSite(lastEditedSite).subscribe();
          this.store.dispatch(new publisherActions.AddSiteToSites(lastEditedSite));
          this.router.navigate(['/publisher', 'dashboard']);
        });
    }
  }

  getSiteFromStore() {
    this.store.select('state', 'publisher', 'lastEditedSite', 'targetingArray')
      .take(1)
      .subscribe((targeting: AssetTargeting) => {
        [targeting.requires, targeting.excludes].forEach((savedList, index) => {
          const searchList = index === 0 ? this.targetingOptionsToAdd : this.targetingOptionsToExclude;
          const choosedList = index === 0 ? this.addedItems : this.excludedItems;

          this.targetingSelectComponent.loadItems(savedList, searchList, choosedList);
        });
      });
  }
}
