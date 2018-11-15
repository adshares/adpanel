import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { AppState } from 'models/app-state.model';
import { campaignInitialState } from 'models/initial-state/campaign';
import { campaignStatusesEnum } from 'models/enum/campaign.enum';
import * as advertiserActions from 'store/advertiser/advertiser.actions';
import { HandleLeaveEditProcess } from 'common/handle-leave-edit-process';

import * as moment from 'moment';
import { appSettings } from 'app-settings';
import { calcCampaignBudgetPerDay, calcCampaignBudgetPerHour } from 'common/utilities/helpers';

@Component({
  selector: 'app-edit-campaign-basic-information',
  templateUrl: './edit-campaign-basic-information.component.html',
  styleUrls: ['./edit-campaign-basic-information.component.scss']
})
export class EditCampaignBasicInformationComponent extends HandleLeaveEditProcess implements OnInit {
  campaignBasicInfoForm: FormGroup;
  campaignBasicInformationSubmitted = false;
  budgetPerDay: FormControl;
  budgetValue: number;
  dateStart = new FormControl();
  dateEnd = new FormControl();
  calcBudgetToHour: boolean = true;
  subscriptionArray: Subscription[] = [];
  today = new Date();

  goesToSummary: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => this.goesToSummary = !!params.summary);
    this.createForm();
  }

  ngOnDestroy() {
    this.subscriptionArray.forEach(subscription => subscription.unsubscribe());
  }

  saveCampaignBasicInformation() {
    this.campaignBasicInformationSubmitted = true;
    if (!this.campaignBasicInfoForm.valid || !this.dateStart) {
      return;
    }

    const campaignBasicInfoValue = this.campaignBasicInfoForm.value;
    const editCampaignStep = this.goesToSummary ? 'summary' : 'additional-targeting';
    const param = this.goesToSummary ? 4 : 2;

    const basicInformation = {
      status: campaignStatusesEnum.DRAFT,
      name: campaignBasicInfoValue.name,
      targetUrl: campaignBasicInfoValue.targetUrl,
      maxCpc: campaignBasicInfoValue.maxCpc,
      maxCpm: campaignBasicInfoValue.maxCpm,
      budget: this.budgetValue,
      dateStart: moment(this.dateStart.value._d).format('YYYY-MM-DD'),
      dateEnd: this.dateEnd.value !== null ? moment(this.dateEnd.value._d).format('YYYY-MM-DD') : null
    };

    this.store.dispatch(new advertiserActions.SaveCampaignBasicInformation(basicInformation));
    this.changesSaved = true;

    this.router.navigate(
      ['/advertiser', 'create-campaign', editCampaignStep],
      {queryParams: {step: param}}
    );
  }

  createForm() {
    const initialBasicinfo = campaignInitialState.basicInformation;
    this.budgetValue = (initialBasicinfo.budget === null) ? 0 : initialBasicinfo.budget;

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

    const initialBudgetPerDay = (initialBasicinfo.budget === null) ?
      '' : calcCampaignBudgetPerDay(initialBasicinfo.budget);
    this.budgetPerDay = new FormControl(initialBudgetPerDay, [
      Validators.required,
      Validators.min(0.01),
    ]);

    this.subscribeBudgetChange();
    this.getFormDataFromStore();
  }

  private subscribeBudgetChange() {
    let subscription: Subscription;

    // calculate budget: hour -> day
    subscription = this.campaignBasicInfoForm.get('budget').valueChanges
      .subscribe((val) => {
        if (!this.calcBudgetToHour) {
          this.budgetValue = val;
          this.budgetPerDay.setValue(calcCampaignBudgetPerDay(val).toFixed(2));
        }
      }, () => {});
    this.subscriptionArray.push(subscription);

    // calculate budget: day -> hour
    subscription = this.budgetPerDay.valueChanges
      .subscribe((val) => {
        if (this.calcBudgetToHour) {
          this.budgetValue = calcCampaignBudgetPerHour(val);
          this.campaignBasicInfoForm.get('budget').setValue(this.budgetValue.toFixed(4));
        }
      }, () => {});
    this.subscriptionArray.push(subscription);
  }

  getFormDataFromStore() {
    this.store.select('state', 'advertiser', 'lastEditedCampaign', 'basicInformation')
      .subscribe((lastEditedCampaign) => {
        this.campaignBasicInfoForm.patchValue(lastEditedCampaign);

        if (lastEditedCampaign.budget) {
          this.budgetPerDay.setValue(calcCampaignBudgetPerDay(lastEditedCampaign.budget));
        }

        this.dateStart.setValue(moment(lastEditedCampaign.dateStart));

        if (lastEditedCampaign.dateEnd) {
          this.dateEnd.setValue(moment(lastEditedCampaign.dateEnd));
        }
      }, () => {});
  }

  onFocus(elemId: string) {
    this.calcBudgetToHour = 'campaign-budget' !== elemId;
  }
}
