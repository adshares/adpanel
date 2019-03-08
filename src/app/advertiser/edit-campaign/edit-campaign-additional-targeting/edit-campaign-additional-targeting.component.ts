import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/first';

import { Store } from '@ngrx/store';
import {
  SaveCampaignTargeting,
  ClearLastEditedCampaign,
  UpdateCampaign,
  AddCampaignToCampaigns
} from 'store/advertiser/advertiser.actions';
import { AppState } from 'models/app-state.model';
import { TargetingOption, TargetingOptionValue } from 'models/targeting-option.model';
import { cloneDeep } from 'common/utilities/helpers';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { AssetHelpersService } from 'common/asset-helpers.service';
import { Campaign } from 'models/campaign.model';
import { TargetingSelectComponent } from 'common/components/targeting/targeting-select/targeting-select.component';
import { HandleSubscription } from "common/handle-subscription";

@Component({
  selector: 'app-edit-campaign-additional-targeting',
  templateUrl: './edit-campaign-additional-targeting.component.html',
  styleUrls: ['./edit-campaign-additional-targeting.component.scss']
})
export class EditCampaignAdditionalTargetingComponent extends HandleSubscription implements OnInit {
  @ViewChild(TargetingSelectComponent) targetingSelectComponent: TargetingSelectComponent;
  excludePanelOpenState: boolean;
  requirePanelOpenState: boolean;
  goesToSummary: boolean;
  campaign: Campaign;
  targetingOptionsToAdd: TargetingOption[];
  targetingOptionsToExclude: TargetingOption[];
  addedItems: TargetingOptionValue[] = [];
  excludedItems: TargetingOptionValue[] = [];
  createCampaignMode: boolean;
  changesSaved: boolean;

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
    this.createCampaignMode = !!this.router.url.match('/create-campaign/');
    this.getTargetingFromStore();
    const subscription = this.advertiserService.cleanEditedCampaignOnRouteChange(!this.createCampaignMode);
    subscription && this.subscriptions.push(subscription);
  }

  updateAddedItems(items) {
    this.addedItems = [...items];
  }

  updateExcludedItems(items) {
    this.excludedItems = [...items];
  }

  onStepBack(): void {
    if (this.createCampaignMode) {
      this.router.navigate(
        ['/advertiser', 'create-campaign', 'basic-information'],
        {queryParams: {step: 1}});
    } else {
      this.store.dispatch(new ClearLastEditedCampaign());
      this.router.navigate(['/advertiser', 'campaign', this.campaign.id]);
    }
  }

  onSubmit() {
    this.createCampaignMode ?
      this.saveCampaignTargeting(false) : this.updateTargeting();
  }

  updateTargeting(): void {
    const targeting = {
      requires: this.addedItems,
      excludes: this.excludedItems
    };
    const updatedCampaign = {...this.campaign, targetingArray: {...targeting}};
    this.store.dispatch(new UpdateCampaign(updatedCampaign));
  }

  saveCampaignTargeting(isDraft): void {
    const chosenTargeting = {
      requires: this.addedItems,
      excludes: this.excludedItems
    };

    this.changesSaved = true;

    if (!isDraft) {
      const editCampaignStep = this.goesToSummary ? 'summary' : 'create-ad';
      const param = this.goesToSummary ? 4 : 3;
      this.store.dispatch(new SaveCampaignTargeting(chosenTargeting));
      this.router.navigate(
        ['/advertiser', 'create-campaign', editCampaignStep],
        {queryParams: {step: param}}
      );
      return;
    } else {
      this.campaign = {
        ...this.campaign,
        targetingArray: chosenTargeting
      };
      this.store.dispatch(new AddCampaignToCampaigns(this.campaign));
    }
  }

  getTargetingFromStore() {
    const lastCampaignSubscription = this.store.select('state', 'advertiser', 'lastEditedCampaign')
      .first()
      .subscribe((lastEditedCampaign: Campaign) => {
        const campaignNameFilled = this.assetHelpers.redirectIfNameNotFilled(lastEditedCampaign);
        this.campaign = lastEditedCampaign;

        if (!campaignNameFilled) {
          this.changesSaved = true;
          return;
        }
        const targeting = lastEditedCampaign.targetingArray;
        this.addedItems = [...targeting.requires];
        this.excludedItems = [...targeting.excludes];
      });
    this.subscriptions.push(lastCampaignSubscription);
  }
}
