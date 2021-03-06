import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/first';

import { Store } from '@ngrx/store';
import {
  AddCampaignToCampaigns,
  ClearLastEditedCampaign,
  SaveCampaignBasicInformation,
  SaveCampaignTargeting,
  UpdateCampaign
} from 'store/advertiser/advertiser.actions';
import { AppState } from 'models/app-state.model';
import { TargetingOption, TargetingOptionValue } from 'models/targeting-option.model';
import { adsToClicks, clicksToAds, cloneDeep, formatMoney } from 'common/utilities/helpers';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { AssetHelpersService } from 'common/asset-helpers.service';
import { Campaign, CampaignsConfig } from 'models/campaign.model';
import { TargetingSelectComponent } from 'common/components/targeting/targeting-select/targeting-select.component';
import { HandleSubscription } from 'common/handle-subscription';
import { environment } from 'environments/environment';
import { CustomValidators } from 'common/utilities/forms';
import { campaignInitialState } from 'models/initial-state/campaign';

@Component({
  selector: 'app-edit-campaign-additional-targeting',
  templateUrl: './edit-campaign-additional-targeting.component.html',
  styleUrls: ['./edit-campaign-additional-targeting.component.scss']
})
export class EditCampaignAdditionalTargetingComponent extends HandleSubscription implements OnInit {
  @ViewChild(TargetingSelectComponent) targetingSelectComponent: TargetingSelectComponent;
  currencyCode: string = environment.currencyCode;
  excludePanelOpenState: boolean;
  requirePanelOpenState: boolean;
  campaign: Campaign;
  targetingOptionsToAdd: TargetingOption[];
  targetingOptionsToExclude: TargetingOption[];
  addedItems: TargetingOptionValue[] = [];
  excludedItems: TargetingOptionValue[] = [];
  createCampaignMode: boolean;
  changesSaved: boolean;
  campaignBasicInfoForm: FormGroup;
  campaignsConfig: CampaignsConfig;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router,
    private advertiserService: AdvertiserService,
    private assetHelpers: AssetHelpersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.targetingOptionsToAdd = cloneDeep(this.route.parent.snapshot.data.targetingOptions);
    this.targetingOptionsToExclude = cloneDeep(this.route.parent.snapshot.data.targetingOptions);
    this.createCampaignMode = !!this.router.url.match('/create-campaign/');

    const campaignsConfigSubscription = this.store.select('state', 'advertiser', 'campaignsConfig')
      .subscribe((campaignsConfig: CampaignsConfig) => {
        this.campaignsConfig = campaignsConfig;
        this.campaignBasicInfoForm = new FormGroup({
          maxCpm: new FormControl(campaignInitialState.basicInformation.maxCpm, [
            CustomValidators.minOrZero(clicksToAds(campaignsConfig.minCpm)),
          ]),
        });
        this.updateMaxCpmFromStore();
      });
    this.subscriptions.push(campaignsConfigSubscription);

    this.updateTargetingFromStore();
    const subscription = this.advertiserService.cleanEditedCampaignOnRouteChange(!this.createCampaignMode);
    subscription && this.subscriptions.push(subscription);
  }

  updateAddedItems(items): void {
    this.addedItems = [...items];
  }

  updateExcludedItems(items): void {
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

  onSubmit(): void {
    this.submitted = true;
    if (!this.campaignBasicInfoForm.valid) {
      return;
    }
    this.submitted = false;

    this.createCampaignMode ?
      this.saveCampaignTargetingAndCpm(false) : this.updateTargetingAndCpm();
  }

  updateTargetingAndCpm(): void {
    const targeting = {
      requires: this.addedItems,
      excludes: this.excludedItems
    };
    const maxCpm = adsToClicks(this.campaignBasicInfoForm.value.maxCpm || 0);

    const updatedCampaign = {
      ...this.campaign,
      basicInformation: {
        ...this.campaign.basicInformation,
        maxCpm: maxCpm,
      },
      targetingArray: {...targeting},
    };

    this.store.dispatch(new UpdateCampaign(updatedCampaign));
  }

  saveCampaignTargetingAndCpm(isDraft): void {
    const chosenTargeting = {
      requires: this.addedItems,
      excludes: this.excludedItems
    };
    const maxCpm = adsToClicks(this.campaignBasicInfoForm.value.maxCpm || 0);

    this.changesSaved = true;

    if (!isDraft) {
      this.store.dispatch(new SaveCampaignTargeting(chosenTargeting));
      const basicInformation = {
        ...this.campaign.basicInformation,
        maxCpm: maxCpm,
      };
      this.store.dispatch(new SaveCampaignBasicInformation(basicInformation));
      this.router.navigate(
        ['/advertiser', 'create-campaign', 'create-ad'],
        {queryParams: {step: 3}}
      );
      return;
    } else {
      this.campaign = {
        ...this.campaign,
        basicInformation: {
          ...this.campaign.basicInformation,
          maxCpm: maxCpm,
        },
        targetingArray: chosenTargeting
      };
      this.store.dispatch(new AddCampaignToCampaigns(this.campaign));
    }
  }

  updateTargetingFromStore(): void {
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

  updateMaxCpmFromStore(): void {
    this.store.select('state', 'advertiser', 'lastEditedCampaign')
      .take(1)
      .subscribe((lastEditedCampaign: Campaign) => {
        if (lastEditedCampaign.basicInformation.maxCpm !== null) {
          const maxCpm = parseFloat(formatMoney(lastEditedCampaign.basicInformation.maxCpm, 4, true, '.', ''));
          this.campaignBasicInfoForm.patchValue({maxCpm});
        }
      });
  }
}
