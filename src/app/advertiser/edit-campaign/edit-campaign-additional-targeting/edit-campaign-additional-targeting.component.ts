import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import * as AdvertiserAction from '../../../store/advertiser/advertiser.action';
import { AppState } from '../../../models/app-state.model';
import { TargetingOptionModel, TargetingOptionValue } from '../../../models/targeting-option.model';
import { cloneDeep } from '../../../common/utilis/helpers';
import { HandleLeaveEditProcess } from '../../../common/handle-leave-edit-process';
import { AdvertiserService } from '../../advertiser.service';
import { Campaign } from '../../../models/campaign.model';

@Component({
  selector: 'app-edit-campaign-additional-targeting',
  templateUrl: './edit-campaign-additional-targeting.component.html',
  styleUrls: ['./edit-campaign-additional-targeting.component.scss']
})
export class EditCampaignAdditionalTargetingComponent extends HandleLeaveEditProcess implements OnInit {
  goesToSummary: boolean;

  targetingOptionsToAdd: TargetingOptionModel[];
  targetingOptionsToExclude: TargetingOptionModel[];
  addedItems: TargetingOptionValue[] = [];
  excludedItems: TargetingOptionValue[] = [];

  requirePanelOpenState: boolean;
  excludePanelOpenState: boolean;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router,
    private advertiserService: AdvertiserService
  ) {
    super();
  }

  ngOnInit() {
    this.targetingOptionsToAdd = cloneDeep(this.route.snapshot.data.targetingOptions);
    this.targetingOptionsToExclude = cloneDeep(this.route.snapshot.data.targetingOptions);
    this.route.queryParams.subscribe(params => this.goesToSummary = params.summary);

    if (this.goesToSummary) {
      this.getTargetingFromStore();
    }
  }

  updateAddedItems(items) {
    this.addedItems = [...items];
  }

  updateExcludedItems(items) {
    this.excludedItems = [...items];
  }

  saveCampaignTargeting(isDraft) {
    const choosedTargeting = {
      requires: this.addedItems,
      excludes: this.excludedItems
    };

    this.changesSaved = true;
    this.store.dispatch(new AdvertiserAction.SaveCampaignTargeting(choosedTargeting));

    if (!isDraft) {
      const editCampaignStep = this.goesToSummary ? 'summary' : 'create-ad';
      const param = this.goesToSummary ? 4 : 3;

      this.router.navigate(
        ['/advertiser', 'create-campaign', editCampaignStep],
        { queryParams: { step: param } }
      );
    } else {
      this.store.select('state', 'advertiser', 'lastEditedCampaign')
        .take(1)
        .subscribe((campaign: Campaign) => {
          this.advertiserService.saveCampaign(campaign).subscribe();
          this.store.dispatch(new AdvertiserAction.SaveCampaignTargeting(choosedTargeting));
          this.store.dispatch(new AdvertiserAction.addCampaignToCampaigns(campaign));
          this.router.navigate(['/advertiser', 'dashboard']);
        });
    }
  }

  getTargetingFromStore() {
    this.store.select('state', 'advertiser', 'lastEditedCampaign', 'targeting')
      .take(1)
      .subscribe((targeting) => {
        this.addedItems = targeting.requires;
        this.excludedItems = targeting.excludes;
        [targeting.requires, targeting.excludes].forEach((optionsList, index) => {
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
