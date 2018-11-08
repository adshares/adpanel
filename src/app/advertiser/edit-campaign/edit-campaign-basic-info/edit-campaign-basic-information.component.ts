import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

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
  budgetPerDay = new FormControl();
  dateStart = new FormControl();
  dateEnd = new FormControl();
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
      budget: campaignBasicInfoValue.budget,
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
        Validators.min(0),
      ]),
    });

    this.budgetPerDay.valueChanges
      .subscribe((val) => {
        this.campaignBasicInfoForm.get('budget').setValue(calcCampaignBudgetPerHour(val).toFixed(11));
      });

    this.getFormDataFromStore();
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
      });
  }
}
