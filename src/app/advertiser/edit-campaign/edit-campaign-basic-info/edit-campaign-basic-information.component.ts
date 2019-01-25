import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs/Subscription';

import {AppState} from 'models/app-state.model';
import {CampaignBasicInformation, Campaign} from "models/campaign.model";
import {campaignInitialState} from 'models/initial-state/campaign';
import {campaignStatusesEnum} from 'models/enum/campaign.enum';
import * as advertiserActions from 'store/advertiser/advertiser.actions';

import * as moment from 'moment';
import {appSettings} from 'app-settings';
import {adsToClicks, calcCampaignBudgetPerDay, calcCampaignBudgetPerHour, formatMoney} from 'common/utilities/helpers';
import {AdvertiserService} from "advertiser/advertiser.service";

@Component({
  selector: 'app-edit-campaign-basic-information',
  templateUrl: './edit-campaign-basic-information.component.html',
  styleUrls: ['./edit-campaign-basic-information.component.scss']
})
export class EditCampaignBasicInformationComponent implements OnInit, OnDestroy {
  campaignBasicInfoForm: FormGroup;
  campaignBasicInformationSubmitted = false;
  budgetPerDay: FormControl;
  budgetValue: number;
  dateStart = new FormControl(campaignInitialState.basicInformation.dateStart.toString(), Validators.required);
  dateEnd = new FormControl();
  calcBudgetToHour: boolean = false;
  subscriptionArray: Subscription[] = [];
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
  }

  ngOnInit() {
    this.createCampaignMode = !!this.router.url.match('/create-campaign/');
    this.route.queryParams.subscribe(params => this.goesToSummary = !!params.summary);
    const subscription = this.advertiserService.cleanEditedCampaignOnRouteChange(!this.createCampaignMode);
    subscription && this.subscriptionArray.push(subscription);
    this.createForm();
  }

  ngOnDestroy() {
    this.subscriptionArray.forEach(subscription => subscription.unsubscribe());
  }

  private setBudgetValue(value?: number): void {
    this.budgetValue = value || 0;
  }

  onSubmit() {
    this.campaignBasicInformationSubmitted = true;
    if (!this.campaignBasicInfoForm.valid || !this.dateStart) {
      return;
    }
    this.createCampaignMode ? this.saveCampaignBasicInformation() : this.updateCampaignBasicInfo();
  }

  get campaignBasicInfo(): CampaignBasicInformation {
    const campaignBasicInfoValue = this.campaignBasicInfoForm.value;

    return {
      status: campaignStatusesEnum.DRAFT,
      name: campaignBasicInfoValue.name,
      targetUrl: campaignBasicInfoValue.targetUrl,
      maxCpc: adsToClicks(campaignBasicInfoValue.maxCpc),
      maxCpm: adsToClicks(campaignBasicInfoValue.maxCpm),
      budget: adsToClicks(this.budgetValue),
      dateStart: moment(this.dateStart.value._d).format(),
      dateEnd: this.dateEnd.value !== null ? moment(this.dateEnd.value._d).format() : null
    };
  }

  saveCampaignBasicInformation() {
    this.store.dispatch(new advertiserActions.SaveCampaignBasicInformation(this.campaignBasicInfo));
    this.changesSaved = true;
    this.router.navigate(
      ['/advertiser', 'create-campaign', 'additional-targeting'],
      {queryParams: {step: 2}}
    );
  }

  updateCampaignBasicInfo() {
    this.campaign = {
      ...this.campaign,
      basicInformation: this.campaignBasicInfo,
    };
    this.store.dispatch(new advertiserActions.UpdateCampaign(this.campaign));
  }

  createForm() {
    const initialBasicinfo = campaignInitialState.basicInformation;
    this.setBudgetValue(initialBasicinfo.budget);
    this.dateStart.setValue(initialBasicinfo.dateStart);

    this.budgetPerDay = new FormControl('', [
      Validators.required,
      Validators.min(0.01),
    ]);

    this.campaignBasicInfoForm = new FormGroup({
      name: new FormControl(initialBasicinfo.name, Validators.required),
      targetUrl: new FormControl(initialBasicinfo.targetUrl, [
        Validators.required,
        Validators.pattern(appSettings.TARGET_URL_REGEXP)
      ]),
      maxCpc: new FormControl(initialBasicinfo.maxCpc, [
        Validators.required,
        Validators.min(0),
      ]),
      maxCpm: new FormControl(initialBasicinfo.maxCpm, [
        Validators.required,
        Validators.min(0),
      ]),
      budget: new FormControl(initialBasicinfo.budget, [
        Validators.required,
        Validators.min(0.0004),
      ]),
    });

    this.subscribeBudgetChange();
    this.getFormDataFromStore();
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
    this.subscriptionArray.push(subscription);

    // calculate budget: day -> hour
    subscription = this.budgetPerDay.valueChanges
      .subscribe((val) => {
        if (this.calcBudgetToHour) {
          this.setBudgetValue(calcCampaignBudgetPerHour(val));
          this.campaignBasicInfoForm.get('budget').setValue(this.budgetValue.toFixed(4));
        }
      }, () => {
      });
    this.subscriptionArray.push(subscription);
  }

  private static convertBasicInfo(lastEditedCampaign: CampaignBasicInformation) {
    const basicInformation = {
      status: lastEditedCampaign.status,
      name: lastEditedCampaign.name,
      targetUrl: lastEditedCampaign.targetUrl,
      maxCpc: null,
      maxCpm: null,
      budget: null,
    };
    if (lastEditedCampaign.maxCpc !== null) {
      basicInformation.maxCpc = formatMoney(lastEditedCampaign.maxCpc, 4, true, '.', '');
    }
    if (lastEditedCampaign.maxCpm !== null) {
      basicInformation.maxCpm = formatMoney(lastEditedCampaign.maxCpm, 4, true, '.', '');
    }
    if (lastEditedCampaign.budget !== null) {
      basicInformation.budget = formatMoney(lastEditedCampaign.budget, 4, true, '.', '');
    }
    return basicInformation;
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
    this.subscriptionArray.push(subscription);
  }

  onFocus(elemId: string) {
    this.calcBudgetToHour = 'campaign-budget' !== elemId;
  }

  onStepBack(): void {
    this.createCampaignMode ? this.router.navigate(['/advertiser', 'dashboard']) :
      this.router.navigate(['/advertiser', 'campaign', this.campaign.id]);
  }
}
