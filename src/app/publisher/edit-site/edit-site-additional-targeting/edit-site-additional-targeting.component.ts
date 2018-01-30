import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import * as PublisherAction from '../../../store/publisher/publisher.actions';
import { AppState } from '../../../models/app-state.model';
import { TargetingOptionModel, TargetingOptionValue } from '../../../models/targeting-option.model';
import { cloneDeep } from '../../../common/utilities/helpers';
import { HandleLeaveEditProcess } from '../../../common/handle-leave-edit-process';
import { PublisherService } from '../../publisher.service';
import { Site } from '../../../models/site.model';
import { siteInitialState } from '../../../models/initial-state/site'

@Component({
  selector: 'app-edit-site-additional-targeting',
  templateUrl: './edit-site-additional-targeting.component.html',
  styleUrls: ['./edit-site-additional-targeting.component.scss']
})
export class EditSiteAdditionalTargetingComponent extends HandleLeaveEditProcess implements OnInit {
  goesToSummary: boolean;

  targetingOptionsToAdd: TargetingOptionModel[];
  targetingOptionsToExclude: TargetingOptionModel[];
  addedItems: TargetingOptionValue[] = [];
  excludedItems: TargetingOptionValue[] = [];
  site: Site = cloneDeep(siteInitialState);

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router,
    private publisherService: PublisherService
  ) {
    super();
  }

  ngOnInit() {
    this.targetingOptionsToAdd = cloneDeep(this.route.snapshot.data.targetingOptions);
    this.targetingOptionsToExclude = cloneDeep(this.route.snapshot.data.targetingOptions);
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

    Object.assign(this.site, { targeting: choosedTargeting });
    this.changesSaved = true;
    this.store.dispatch(new PublisherAction.SaveLastEditedSite(this.site));

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
          this.publisherService.saveSite(this.site).subscribe();
          this.store.dispatch(new PublisherAction.AddSiteToSites(this.site));
          this.router.navigate(['/publisher', 'dashboard']);
        });
    }
  }

  getSiteFromStore() {
    this.store.select('state', 'publisher', 'lastEditedSite')
      .take(1)
      .subscribe((lastEditedSite: Site) => {
        this.site = lastEditedSite;
        this.addedItems = lastEditedSite.targeting.requires;
        this.excludedItems = lastEditedSite.targeting.excludes;

        [this.addedItems, this.excludedItems].forEach((optionsList, index) => {
          const searchList = index === 0 ? this.targetingOptionsToAdd : this.targetingOptionsToExclude;

          optionsList.forEach((savedItem) => this.findAdnSelectItem(searchList, savedItem));
        });
      });
  }

  findAdnSelectItem(list, searchedItem) {
    list.forEach((item) => {
      const itemSublist = item.children || item.values;

      if (itemSublist) {
        this.findAdnSelectItem(itemSublist, searchedItem);
        return;
      }

      if (item.label === searchedItem.label && item.parent_label === searchedItem.parent_label) {
        Object.assign(item, { selected: true })
      }
    });
  }
}
