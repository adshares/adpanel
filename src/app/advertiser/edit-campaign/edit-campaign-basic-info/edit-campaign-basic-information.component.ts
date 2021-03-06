import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { AppState } from 'models/app-state.model';
import { Campaign, CampaignBasicInformation, CampaignsConfig } from 'models/campaign.model';
import { campaignInitialState } from 'models/initial-state/campaign';
import { campaignStatusesEnum } from 'models/enum/campaign.enum';
import {
  LoadCampaignsConfig,
  SaveCampaignBasicInformation,
  UpdateCampaign,
} from 'store/advertiser/advertiser.actions';


import * as moment from 'moment';
import { appSettings } from 'app-settings';
import {
  adsToClicks,
  calcCampaignBudgetPerDay,
  calcCampaignBudgetPerHour,
  clicksToAds,
  formatMoney
} from 'common/utilities/helpers';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { HandleSubscription } from 'common/handle-subscription';
import { environment } from 'environments/environment';
import { CustomValidators } from "common/utilities/forms";

@Component({
  selector: 'app-edit-campaign-basic-information',
  templateUrl: './edit-campaign-basic-information.component.html',
  styleUrls: ['./edit-campaign-basic-information.component.scss']
})
export class EditCampaignBasicInformationComponent extends HandleSubscription implements OnInit, OnDestroy {
  currencyCode: string = environment.currencyCode;
  campaignsConfig: CampaignsConfig;
  campaignBasicInfoForm: FormGroup;
  campaignBasicInformationSubmitted = false;
  budgetPerDay: FormControl;
  budgetValue: number;
  dateStart = new FormControl(campaignInitialState.basicInformation.dateStart.toString(), Validators.required);
  dateEnd = new FormControl();
  calcBudgetToHour: boolean = false;
  today = new Date();
  goesToSummary: boolean;
  createCampaignMode: boolean;
  campaign: Campaign;
  changesSaved: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private advertiserService: AdvertiserService,
  ) {
    super();
  }

  get campaignBasicInfo(): CampaignBasicInformation {
    const campaignBasicInfoValue = this.campaignBasicInfoForm.value;

    return {
      status: campaignStatusesEnum.DRAFT,
      name: campaignBasicInfoValue.name,
      targetUrl: campaignBasicInfoValue.targetUrl,
      maxCpc: 0, // adsToClicks(campaignBasicInfoValue.maxCpc || 0),
      maxCpm: adsToClicks(campaignBasicInfoValue.maxCpm || 0),
      budget: adsToClicks(this.budgetValue || 0),
      dateStart: moment(this.dateStart.value._d).format(),
      dateEnd: this.dateEnd.value !== null ? moment(this.dateEnd.value._d).format() : null
    };
  }

  private static convertBasicInfo(lastEditedCampaign: CampaignBasicInformation) {
    const basicInformation = {
      status: lastEditedCampaign.status,
      name: lastEditedCampaign.name,
      targetUrl: lastEditedCampaign.targetUrl,
      maxCpc: 0,
      maxCpm: null,
      budget: null,
    };
    if (lastEditedCampaign.maxCpc !== null) {
      basicInformation.maxCpc = 0; // formatMoney(lastEditedCampaign.maxCpc, 4, true, '.', '');
    }
    if (lastEditedCampaign.maxCpm !== null) {
      basicInformation.maxCpm = parseFloat(formatMoney(lastEditedCampaign.maxCpm, 4, true, '.', ''));
    }
    if (lastEditedCampaign.budget !== null) {
      basicInformation.budget = parseFloat(formatMoney(lastEditedCampaign.budget, 4, true, '.', ''));
    }
    return basicInformation;
  }

  ngOnInit() {
    this.store.dispatch(new LoadCampaignsConfig());
    this.createCampaignMode = !!this.router.url.match('/create-campaign/');
    this.route.queryParams.subscribe(params => this.goesToSummary = !!params.summary);
    const subscription = this.advertiserService.cleanEditedCampaignOnRouteChange(!this.createCampaignMode);

    const campaignsConfigSubscription = this.store.select('state', 'advertiser', 'campaignsConfig')
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
    this.router.navigate(
      ['/advertiser', 'create-campaign', 'additional-targeting'],
      {queryParams: {step: 2}}
    );
  }

  updateCampaignBasicInfo() {
    this.changesSaved = true;
    this.campaign = {
      ...this.campaign,
      basicInformation: {...this.campaignBasicInfo, status: this.campaign.basicInformation.status},
    };

    this.store.dispatch(new UpdateCampaign(this.campaign));
  }

  createForm() {
    const initialBasicinfo = campaignInitialState.basicInformation;
    this.setBudgetValue(initialBasicinfo.budget);
    this.dateStart.setValue(initialBasicinfo.dateStart);

    this.budgetPerDay = new FormControl('', [
      Validators.required,
      Validators.min(clicksToAds(calcCampaignBudgetPerDay(this.campaignsConfig.minBudget))),
    ]);

    this.campaignBasicInfoForm = new FormGroup({
      name: new FormControl(initialBasicinfo.name, Validators.required),
      targetUrl: new FormControl(initialBasicinfo.targetUrl, [
        Validators.required,
        Validators.pattern(appSettings.TARGET_URL_REGEXP)
      ]),
      maxCpc: new FormControl(initialBasicinfo.maxCpc),
      maxCpm: new FormControl(initialBasicinfo.maxCpm, [
        CustomValidators.minOrZero(clicksToAds(this.campaignsConfig.minCpm)),
      ]),
      budget: new FormControl(initialBasicinfo.budget, [
        Validators.required,
        Validators.min(clicksToAds(this.campaignsConfig.minBudget)),
      ]),
    });

    this.subscribeBudgetChange();
    this.getFormDataFromStore();
  }

  getFormDataFromStore() {
    let subscription = this.store.select('state', 'advertiser', 'lastEditedCampaign',)
      .subscribe((lastEditedCampaign: Campaign) => {
        this.campaign = lastEditedCampaign;
        this.setBudgetValue(lastEditedCampaign.basicInformation.budget);
        const basicInformation = EditCampaignBasicInformationComponent.convertBasicInfo(lastEditedCampaign.basicInformation);
        this.campaignBasicInfoForm.patchValue(basicInformation);

        this.dateStart.setValue(moment(lastEditedCampaign.basicInformation.dateStart));

        if (lastEditedCampaign.basicInformation.dateEnd) {
          this.dateEnd.setValue(moment(lastEditedCampaign.basicInformation.dateEnd));
        }
      }, () => {
      });
    this.subscriptions.push(subscription);
  }

  onFocus(elemId: string) {
    this.calcBudgetToHour = 'campaign-budget' !== elemId;
  }

  onStepBack(): void {
    this.createCampaignMode ? this.router.navigate(['/advertiser', 'dashboard']) :
      this.router.navigate(['/advertiser', 'campaign', this.campaign.id]);
  }

  private setBudgetValue(value?: number): void {
    this.budgetValue = value || 0;
  }

  private subscribeBudgetChange() {
    let subscription: Subscription;

    // calculate budget: hour -> day
    subscription = this.campaignBasicInfoForm.get('budget').valueChanges
      .subscribe((val) => {
        if (!this.calcBudgetToHour) {
          this.setBudgetValue(val);
          const budgetPerDayValue = (val !== null) ? calcCampaignBudgetPerDay(val).toFixed(2) : '';
          this.budgetPerDay.setValue(budgetPerDayValue);
        }
      }, () => {
      });
    this.subscriptions.push(subscription);

    // calculate budget: day -> hour
    subscription = this.budgetPerDay.valueChanges
      .subscribe((val) => {
        if (this.calcBudgetToHour) {
          this.setBudgetValue(calcCampaignBudgetPerHour(val));
          this.campaignBasicInfoForm.get('budget').setValue(this.budgetValue.toFixed(4));
        }
      }, () => {
      });
    this.subscriptions.push(subscription);
  }
}
