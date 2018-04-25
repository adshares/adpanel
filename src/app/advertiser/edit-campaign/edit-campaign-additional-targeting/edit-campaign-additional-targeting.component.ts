import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/first';

import { Store } from '@ngrx/store';
import * as advertiserActions from 'store/advertiser/advertiser.actions';
import { AppState } from 'models/app-state.model';
import { TargetingOption, TargetingOptionValue } from 'models/targeting-option.model';
import { cloneDeep } from 'common/utilities/helpers';
import { HandleLeaveEditProcess } from 'common/handle-leave-edit-process';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { AssetHelpersService } from 'common/asset-helpers.service';
import { Campaign } from 'models/campaign.model';
import { AssetTargeting } from 'models/targeting-option.model';
import { TargetingSelectComponent } from 'common/components/targeting/targeting-select/targeting-select.component';

@Component({
  selector: 'app-edit-campaign-additional-targeting',
  templateUrl: './edit-campaign-additional-targeting.component.html',
  styleUrls: ['./edit-campaign-additional-targeting.component.scss']
})
export class EditCampaignAdditionalTargetingComponent extends HandleLeaveEditProcess implements OnInit {
  @ViewChild(TargetingSelectComponent) targetingSelectComponent: TargetingSelectComponent;

  goesToSummary: boolean;

  subscriptions: Subscription[] = [];
  targetingOptionsToAdd: TargetingOption[];
  targetingOptionsToExclude: TargetingOption[];
  addedItems: TargetingOptionValue[] = [];
  excludedItems: TargetingOptionValue[] = [];

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router,
    private advertiserService: AdvertiserService,
    private assetHelpers: AssetHelpersService
  ) {
    super();
  }

  ngOnInit() {
    this.targetingOptionsToAdd = cloneDeep(this.route.parent.snapshot.data.targetingOptions);
    this.targetingOptionsToExclude = cloneDeep(this.route.parent.snapshot.data.targetingOptions);
    this.route.queryParams.subscribe(params => this.goesToSummary = !!params.summary);
    this.getTargetingFromStore();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  updateAddedItems(items) {
    this.addedItems = [...items];
  }

  updateExcludedItems(items) {
    this.excludedItems = [...items];
  }

  saveCampaignTargeting(isDraft) {
    const chosenTargeting = {
      requires: this.addedItems,
      excludes: this.excludedItems
    };

    this.changesSaved = true;
    this.store.dispatch(new advertiserActions.SaveCampaignTargeting(chosenTargeting));

    if (!isDraft) {
      const editCampaignStep = this.goesToSummary ? 'summary' : 'create-ad';
      const param = this.goesToSummary ? 4 : 3;

      this.router.navigate(
        ['/advertiser', 'create-campaign', editCampaignStep],
        { queryParams: { step: param } }
      );

      return;
    }

    const lastCampaignSubscription = this.store.select('state', 'advertiser', 'lastEditedCampaign')
      .first()
      .subscribe((campaign: Campaign) => {
        this.store.dispatch(new advertiserActions.AddCampaignToCampaigns(campaign));
        this.router.navigate(['/advertiser', 'dashboard']);
      });
    this.subscriptions.push(lastCampaignSubscription);
  }

  getTargetingFromStore() {
    const lastCampaignSubscription = this.store.select('state', 'advertiser', 'lastEditedCampaign')
      .first()
      .subscribe((lastEditedCampaign: Campaign) => {
        const campaignNameFilled = this.assetHelpers.redirectIfNameNotFilled(lastEditedCampaign);

        if (!campaignNameFilled) {
          this.changesSaved = true;
          return;
        }

        const targeting = lastEditedCampaign.targetingArray;

        [this.addedItems, this.excludedItems] = [[...targeting.requires], [...targeting.excludes]];
      });
    this.subscriptions.push(lastCampaignSubscription);
  }
}
