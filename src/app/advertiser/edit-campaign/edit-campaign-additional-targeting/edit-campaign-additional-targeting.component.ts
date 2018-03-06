import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import * as advertiserActions from '../../../store/advertiser/advertiser.actions';
import { AppState } from '../../../models/app-state.model';
import { TargetingOption, TargetingOptionValue } from '../../../models/targeting-option.model';
import { cloneDeep } from '../../../common/utilities/helpers';
import { HandleLeaveEditProcess } from '../../../common/handle-leave-edit-process';
import { AdvertiserService } from '../../advertiser.service';
import { Campaign } from '../../../models/campaign.model';
import { AssetTargeting } from '../../../models/targeting-option.model';
import { TargetingSelectComponent } from '../../../common/components/targeting/targeting-select/targeting-select.component';

@Component({
  selector: 'app-edit-campaign-additional-targeting',
  templateUrl: './edit-campaign-additional-targeting.component.html',
  styleUrls: ['./edit-campaign-additional-targeting.component.scss']
})
export class EditCampaignAdditionalTargetingComponent extends HandleLeaveEditProcess implements OnInit {
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
    private advertiserService: AdvertiserService
  ) {
    super();
  }

  ngOnInit() {
    this.targetingOptionsToAdd = cloneDeep(this.route.parent.snapshot.data.targetingOptions);
    this.targetingOptionsToExclude = cloneDeep(this.route.parent.snapshot.data.targetingOptions);
    this.route.queryParams.subscribe(params => this.goesToSummary = !!params.summary);

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
    this.store.dispatch(new advertiserActions.SaveCampaignTargeting(choosedTargeting));

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
          this.store.dispatch(new advertiserActions.AddCampaignToCampaigns(campaign));
          this.router.navigate(['/advertiser', 'dashboard']);
        });
    }
  }

  getTargetingFromStore() {
    this.store.select('state', 'advertiser', 'lastEditedCampaign', 'targetingArray')
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
