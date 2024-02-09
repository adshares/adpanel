import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { AppState } from 'models/app-state.model';
import { Campaign, CampaignBasicInformation, CampaignsConfig } from 'models/campaign.model';
import { campaignInitialState } from 'models/initial-state/campaign';
import { campaignStatusesEnum } from 'models/enum/campaign.enum';
import { Entry } from 'models/targeting-option.model';
import {
  LoadCampaignsConfig,
  SaveCampaignBasicInformation,
  UpdateCampaign,
  UPDATE_CAMPAIGN_FAILURE,
} from 'store/advertiser/advertiser.actions';

import * as moment from 'moment';
import { appSettings } from 'app-settings';
import {
  adsToClicks,
  calcCampaignBudgetPerDay,
  calcCampaignBudgetPerHour,
  clicksToAds,
  formatMoney,
  mapToIterable,
} from 'common/utilities/helpers';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { CustomValidators } from 'common/utilities/forms';
import { ServerOptionsService } from 'common/server-options.service';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-edit-campaign-basic-information',
  templateUrl: './edit-campaign-basic-information.component.html',
  styleUrls: ['./edit-campaign-basic-information.component.scss'],
})
export class EditCampaignBasicInformationComponent extends HandleSubscriptionComponent implements OnInit, OnDestroy {
  private static readonly ANY_VENDOR: string = 'any';
  currencyCode: string;
  campaignsConfig: CampaignsConfig;
  campaignBasicInfoForm: FormGroup;
  campaignBasicInformationSubmitted = false;
  budgetPerDay: FormControl;
  experimentBudgetPerDay: FormControl;
  budgetValue: number;
  dateStart = new FormControl(campaignInitialState.basicInformation.dateStart.toString(), Validators.required);
  dateEnd = new FormControl();
  calcBudgetToHour: boolean = false;
  today = moment();
  goesToSummary: boolean;
  createCampaignMode: boolean;
  campaign: Campaign;
  changesSaved: boolean;
  isAutoCpm: boolean;
  media: Entry[];
  vendors: Entry[] = [];
  faCalendar = faCalendar;
  experimentBudgetValue: number;
  experimentEndAt = new FormControl();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private advertiserService: AdvertiserService,
    private serverOptionsService: ServerOptionsService,
    private actions$: Actions
  ) {
    super();
  }

  get campaignBasicInfo(): CampaignBasicInformation {
    const campaignBasicInfoValue = this.campaignBasicInfoForm.getRawValue();

    return {
      status: campaignStatusesEnum.DRAFT,
      name: campaignBasicInfoValue.name,
      targetUrl: campaignBasicInfoValue.targetUrl,
      maxCpc: 0,
      maxCpm:
        this.isAutoCpm || campaignBasicInfoValue.maxCpm === null
          ? null
          : adsToClicks(campaignBasicInfoValue.maxCpm || 0),
      budget: adsToClicks(this.budgetValue || 0),
      medium: campaignBasicInfoValue.medium,
      vendor:
        EditCampaignBasicInformationComponent.ANY_VENDOR === campaignBasicInfoValue.vendor
          ? null
          : campaignBasicInfoValue.vendor,
      dateStart: moment(this.dateStart.value._d).format(),
      dateEnd: this.dateEnd.value !== null ? moment(this.dateEnd.value._d).format() : null,
      experimentBudget: adsToClicks(this.experimentBudgetValue || 0),
      experimentEndAt: this.experimentEndAt.value !== null ? moment(this.experimentEndAt.value._d).format() : null,
    };
  }

  private static convertBasicInfo(lastEditedCampaign: CampaignBasicInformation) {
    const basicInformation = {
      status: lastEditedCampaign.status,
      name: lastEditedCampaign.name,
      targetUrl: lastEditedCampaign.targetUrl,
      medium: lastEditedCampaign.medium,
      vendor: lastEditedCampaign.vendor || EditCampaignBasicInformationComponent.ANY_VENDOR,
      maxCpc: 0,
      maxCpm: null,
      budget: null,
      experimentBudget: null,
    };
    if (lastEditedCampaign.maxCpm !== null) {
      basicInformation.maxCpm = parseFloat(formatMoney(lastEditedCampaign.maxCpm, 4, true, '.', ''));
    }
    if (lastEditedCampaign.budget !== null) {
      basicInformation.budget = parseFloat(formatMoney(lastEditedCampaign.budget, 4, true, '.', ''));
    }
    if (lastEditedCampaign.experimentBudget !== null) {
      basicInformation.experimentBudget = parseFloat(
        formatMoney(lastEditedCampaign.experimentBudget, 4, true, '.', '')
      );
    }
    return basicInformation;
  }

  ngOnInit(): void {
    this.currencyCode = this.serverOptionsService.getOptions().displayCurrency;
    this.store.dispatch(new LoadCampaignsConfig());
    this.createCampaignMode = !!this.router.url.match('/create-campaign/');
    this.route.queryParams.subscribe(params => (this.goesToSummary = !!params.summary));
    const subscription = this.advertiserService.cleanEditedCampaignOnRouteChange(!this.createCampaignMode);

    const campaignsConfigSubscription = this.store
      .select('state', 'advertiser', 'campaignsConfig')
      .subscribe((campaignsConfig: CampaignsConfig) => {
        this.campaignsConfig = campaignsConfig;
        this.createForm();
      });

    subscription && this.subscriptions.push(subscription);
    this.subscriptions.push(campaignsConfigSubscription);
  }

  onSubmit() {
    this.campaignBasicInformationSubmitted = true;
    if (!this.campaignBasicInfoForm.valid || !this.dateStart.value) {
      return;
    }
    this.campaignBasicInformationSubmitted = false;
    this.createCampaignMode ? this.saveCampaignBasicInformation() : this.updateCampaignBasicInfo();
  }

  saveCampaignBasicInformation() {
    this.store.dispatch(new SaveCampaignBasicInformation(this.campaignBasicInfo));
    this.changesSaved = true;
    this.router.navigate(['/advertiser', 'create-campaign', 'additional-targeting']);
  }

  updateCampaignBasicInfo() {
    this.changesSaved = true;
    this.campaign = {
      ...this.campaign,
      basicInformation: {
        ...this.campaignBasicInfo,
        status: this.campaign.basicInformation.status,
      },
    };

    this.store.dispatch(new UpdateCampaign(this.campaign));

    const errorSubscription = this.actions$.pipe(ofType(UPDATE_CAMPAIGN_FAILURE)).subscribe(() => {
      this.changesSaved = false;
    });
    this.subscriptions.push(errorSubscription);
  }

  createForm() {
    const initialBasicInfo = campaignInitialState.basicInformation;
    this.setBudgetValue(initialBasicInfo.budget);
    this.setExperimentBudgetValue(initialBasicInfo.experimentBudget);
    this.dateStart.setValue(initialBasicInfo.dateStart);
    this.media = mapToIterable(this.route.snapshot.data.media);

    this.budgetPerDay = new FormControl('', [
      Validators.required,
      Validators.min(clicksToAds(calcCampaignBudgetPerDay(this.campaignsConfig.minBudget))),
    ]);
    this.experimentBudgetPerDay = new FormControl('', [
      Validators.required,
      Validators.min(clicksToAds(calcCampaignBudgetPerDay(this.campaignsConfig.minBudgetExperiment))),
    ]);

    this.campaignBasicInfoForm = new FormGroup({
      name: new FormControl(initialBasicInfo.name, Validators.required),
      targetUrl: new FormControl(initialBasicInfo.targetUrl, [
        Validators.required,
        Validators.pattern(appSettings.TARGET_URL_REGEXP),
      ]),
      maxCpm: new FormControl(initialBasicInfo.maxCpm, [
        CustomValidators.minOrZero(clicksToAds(this.campaignsConfig.minCpm)),
      ]),
      budget: new FormControl(initialBasicInfo.budget, [
        Validators.required,
        Validators.min(clicksToAds(this.campaignsConfig.minBudget)),
      ]),
      experimentBudget: new FormControl(initialBasicInfo.experimentBudget, [
        Validators.required,
        Validators.min(clicksToAds(this.campaignsConfig.minBudgetExperiment)),
      ]),
      medium: new FormControl({
        value: initialBasicInfo.medium,
        disabled: !this.createCampaignMode,
      }),
      vendor: new FormControl({
        value: initialBasicInfo.vendor || EditCampaignBasicInformationComponent.ANY_VENDOR,
        disabled: !this.createCampaignMode,
      }),
    });

    this.subscribeBudgetChange();
    this.loadFormDataFromStore();
  }

  loadFormDataFromStore() {
    const subscription = this.store
      .select('state', 'advertiser', 'lastEditedCampaign')
      .subscribe((lastEditedCampaign: Campaign) => {
        this.campaign = lastEditedCampaign;
        this.isAutoCpm = lastEditedCampaign.basicInformation.maxCpm === null;
        this.setBudgetValue(lastEditedCampaign.basicInformation.budget);
        this.setExperimentBudgetValue(lastEditedCampaign.basicInformation.experimentBudget);
        const basicInformation = EditCampaignBasicInformationComponent.convertBasicInfo(
          lastEditedCampaign.basicInformation
        );
        this.campaignBasicInfoForm.patchValue(basicInformation);
        this.onMediumChange(basicInformation.medium);

        this.dateStart.setValue(moment(lastEditedCampaign.basicInformation.dateStart));

        if (lastEditedCampaign.basicInformation.dateEnd) {
          this.dateEnd.setValue(moment(lastEditedCampaign.basicInformation.dateEnd));
        }
        if (lastEditedCampaign.basicInformation.experimentEndAt) {
          this.experimentEndAt.setValue(moment(lastEditedCampaign.basicInformation.experimentEndAt));
        }
      });
    this.subscriptions.push(subscription);
  }

  onFocus(elemId: string) {
    this.calcBudgetToHour = 'campaign-budget' !== elemId;
  }

  onStepBack(): void {
    this.createCampaignMode
      ? this.router.navigate(['/advertiser', 'dashboard'])
      : this.router.navigate(['/advertiser', 'campaign', this.campaign.id]);
  }

  private setBudgetValue(value?: number): void {
    this.budgetValue = value || 0;
  }

  private setExperimentBudgetValue(value?: number): void {
    this.experimentBudgetValue = value || 0;
  }

  private subscribeBudgetChange() {
    let subscription: Subscription;

    // calculate budget: hour -> day
    subscription = this.campaignBasicInfoForm.get('budget').valueChanges.subscribe(val => {
      if (!this.calcBudgetToHour) {
        this.setBudgetValue(val);
        const budgetPerDayValue = val !== null ? calcCampaignBudgetPerDay(val).toFixed(2) : '';
        this.budgetPerDay.setValue(budgetPerDayValue);
      }
    });
    this.subscriptions.push(subscription);
    subscription = this.campaignBasicInfoForm.get('experimentBudget').valueChanges.subscribe(val => {
      if (!this.calcBudgetToHour) {
        this.setExperimentBudgetValue(val);
        const budgetPerDayValue = val !== null ? calcCampaignBudgetPerDay(val).toFixed(2) : '';
        this.experimentBudgetPerDay.setValue(budgetPerDayValue);
      }
    });
    this.subscriptions.push(subscription);

    // calculate budget: day -> hour
    subscription = this.budgetPerDay.valueChanges.subscribe(val => {
      if (this.calcBudgetToHour) {
        this.setBudgetValue(calcCampaignBudgetPerHour(val));
        this.campaignBasicInfoForm.get('budget').setValue(this.budgetValue.toFixed(4));
      }
    });
    this.subscriptions.push(subscription);
    subscription = this.experimentBudgetPerDay.valueChanges.subscribe(val => {
      if (this.calcBudgetToHour) {
        this.setExperimentBudgetValue(calcCampaignBudgetPerHour(val));
        this.campaignBasicInfoForm.get('experimentBudget').setValue(this.experimentBudgetValue.toFixed(4));
      }
    });
    this.subscriptions.push(subscription);
  }

  changeAutoCpm(checked: boolean) {
    this.isAutoCpm = checked;
  }

  onMediumChange(medium: string): void {
    const subscription = this.advertiserService
      .getMediumVendors(medium)
      .pipe(take(1))
      .subscribe(vendors => {
        const temporaryVendors = mapToIterable(vendors);
        if (temporaryVendors.length > 0) {
          temporaryVendors.unshift({ key: EditCampaignBasicInformationComponent.ANY_VENDOR, value: 'Any' });
        }
        this.vendors = temporaryVendors;
        if (this.createCampaignMode) {
          this.campaignBasicInfoForm.get('vendor').patchValue(EditCampaignBasicInformationComponent.ANY_VENDOR);
        }
      });
    this.subscriptions.push(subscription);
  }

  get isTaxonomy(): boolean {
    return this.media.length > 0;
  }
}
