import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { filter, first, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
  AddCampaignToCampaigns,
  ClearLastEditedCampaign,
  SaveCampaignBasicInformation,
  SaveCampaignTargeting,
  UpdateCampaign,
} from 'store/advertiser/advertiser.actions';
import { AppState } from 'models/app-state.model';
import { TargetingOption, TargetingOptionValue } from 'models/targeting-option.model';
import { adsToClicks, clicksToAds, cloneDeep, formatMoney } from 'common/utilities/helpers';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { AssetHelpersService } from 'common/asset-helpers.service';
import { Campaign } from 'models/campaign.model';
import { processTargeting } from 'common/components/targeting/targeting.helpers';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { CustomValidators } from 'common/utilities/forms';
import { ServerOptionsService } from 'common/server-options.service';

@Component({
  selector: 'app-edit-campaign-additional-targeting',
  templateUrl: './edit-campaign-additional-targeting.component.html',
  styleUrls: ['./edit-campaign-additional-targeting.component.scss'],
})
export class EditCampaignAdditionalTargetingComponent extends HandleSubscriptionComponent implements OnInit {
  currencyCode: string;
  excludePanelOpenState: boolean;
  requirePanelOpenState: boolean;
  campaign: Campaign;
  targetingOptionsToAdd: TargetingOption[] = [];
  targetingOptionsToExclude: TargetingOption[] = [];
  addedItems: TargetingOptionValue[] = [];
  excludedItems: TargetingOptionValue[] = [];
  createCampaignMode: boolean;
  changesSaved: boolean;
  campaignBasicInfoForm: FormGroup;
  isAutoCpm: boolean = true;
  configuredMinCpm: number;
  submitted = false;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router,
    private advertiserService: AdvertiserService,
    private serverOptionsService: ServerOptionsService,
    private assetHelpers: AssetHelpersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.currencyCode = this.serverOptionsService.getOptions().displayCurrency;
    this.createCampaignMode = !!this.router.url.match('/create-campaign/');

    this.loadMaxCpmAndTargetingFromStore();
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
      this.router.navigate(['/advertiser', 'create-campaign', 'basic-information']);
    } else {
      this.store.dispatch(new ClearLastEditedCampaign());
      this.router.navigate(['/advertiser', 'campaign', this.campaign.id]);
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.isAutoCpm && !this.campaignBasicInfoForm.valid) {
      return;
    }
    this.submitted = false;

    this.createCampaignMode ? this.saveCampaignTargetingAndCpm(false) : this.updateTargetingAndCpm();
  }

  updateTargetingAndCpm(): void {
    const targeting = {
      requires: this.addedItems,
      excludes: this.excludedItems,
    };
    const maxCpm = this.isAutoCpm ? null : adsToClicks(this.campaignBasicInfoForm.value.maxCpm || 0);

    const updatedCampaign = {
      ...this.campaign,
      basicInformation: {
        ...this.campaign.basicInformation,
        maxCpm: maxCpm,
      },
      targetingArray: { ...targeting },
    };

    this.store.dispatch(new UpdateCampaign(updatedCampaign));
  }

  saveCampaignTargetingAndCpm(isDraft): void {
    const chosenTargeting = {
      requires: this.addedItems,
      excludes: this.excludedItems,
    };
    const maxCpm = this.isAutoCpm ? null : adsToClicks(this.campaignBasicInfoForm.value.maxCpm || 0);

    this.changesSaved = true;

    if (!isDraft) {
      this.store.dispatch(new SaveCampaignTargeting(chosenTargeting));
      const basicInformation = {
        ...this.campaign.basicInformation,
        maxCpm: maxCpm,
      };
      this.store.dispatch(new SaveCampaignBasicInformation(basicInformation));
      this.router.navigate(['/advertiser', 'create-campaign', 'create-ad']);
    } else {
      this.campaign = {
        ...this.campaign,
        basicInformation: {
          ...this.campaign.basicInformation,
          maxCpm: maxCpm,
        },
        targetingArray: chosenTargeting,
      };
      this.store.dispatch(new AddCampaignToCampaigns(this.campaign));
    }
  }

  loadMaxCpmAndTargetingFromStore(): void {
    const lastCampaignSubscription = this.store
      .select('state', 'advertiser', 'lastEditedCampaign')
      .pipe(
        filter(campaign => campaign.targetingArray !== undefined),
        first()
      )
      .subscribe((lastEditedCampaign: Campaign) => {
        const campaignNameFilled = this.assetHelpers.redirectIfNameNotFilled(lastEditedCampaign);
        this.campaign = lastEditedCampaign;

        if (!campaignNameFilled) {
          this.changesSaved = true;
          return;
        }
        this.updateMaxCpm(lastEditedCampaign);
        this.updateTargeting(lastEditedCampaign);
      });
    this.subscriptions.push(lastCampaignSubscription);
  }

  private updateMaxCpm(lastEditedCampaign: Campaign): void {
    if (lastEditedCampaign.basicInformation.maxCpm !== null) {
      this.isAutoCpm = false;
      const maxCpm = parseFloat(formatMoney(lastEditedCampaign.basicInformation.maxCpm, 4, true, '.', ''));

      const campaignsConfigSubscription = this.store
        .select('state', 'advertiser', 'campaignsConfig', 'minCpm')
        .pipe(take(1))
        .subscribe((minCpm: number) => {
          this.configuredMinCpm = minCpm;
          this.campaignBasicInfoForm = new FormGroup({
            maxCpm: new FormControl(maxCpm, [CustomValidators.minOrZero(clicksToAds(minCpm))]),
          });
        });
      this.subscriptions.push(campaignsConfigSubscription);
    }
  }

  private updateTargeting(campaign: Campaign): void {
    const targetingSubscription = this.advertiserService
      .getMedium(campaign.basicInformation.medium, campaign.basicInformation.vendor)
      .pipe(take(1))
      .subscribe(
        medium => {
          this.targetingOptionsToAdd = processTargeting(medium);
          this.targetingOptionsToExclude = cloneDeep(this.targetingOptionsToAdd);
          this.addedItems = [...campaign.targetingArray.requires];
          this.excludedItems = [...campaign.targetingArray.excludes];
          this.isLoading = false;
        },
        () => (this.isLoading = false)
      );
    this.subscriptions.push(targetingSubscription);
  }
}
