import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as moment from 'moment';

import { AppState } from 'models/app-state.model';
import { campaignInitialState } from 'models/initial-state/campaign';
import { campaignStatusesEnum } from 'models/enum/campaign.enum';
import * as advertiserActions from 'store/advertiser/advertiser.actions';
import { HandleLeaveEditProcess } from 'common/handle-leave-edit-process';

@Component({
  selector: 'app-edit-campaign-basic-information',
  templateUrl: './edit-campaign-basic-information.component.html',
  styleUrls: ['./edit-campaign-basic-information.component.scss']
})
export class EditCampaignBasicInformationComponent extends HandleLeaveEditProcess implements OnInit {
  campaignBasicInfoForm: FormGroup;
  campaignBasicInformationSubmitted = false;
  dateStart = new FormControl();
  dateEnd = new FormControl();
  minDate = moment().format('L');
  maxDate = moment().add(1, 'year').format('L');

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
    console.log(this.campaignBasicInfoForm.controls.targetUrl)
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
      bidStrategyName: campaignBasicInfoValue.bidStrategyName,
      bidValue: campaignBasicInfoValue.bidValue,
      budget: campaignBasicInfoValue.budget,
      dateStart: moment(this.dateStart.value._d).format('L'),
      dateEnd: this.dateEnd.value !== null ? moment(this.dateEnd.value._d).format('L') : null
    };

    this.store.dispatch(new advertiserActions.SaveCampaignBasicInformation(basicInformation));
    this.changesSaved = true;

    this.router.navigate(
      ['/advertiser', 'create-campaign', editCampaignStep],
      { queryParams: { step: param } }
    );
  }

  createForm() {
    const initialBasicinfo = campaignInitialState.basicInformation;

    this.campaignBasicInfoForm = new FormGroup({
      name: new FormControl(initialBasicinfo.name, Validators.required),
      targetUrl: new FormControl(initialBasicinfo.targetUrl, Validators.required),
      bidStrategyName: new FormControl(initialBasicinfo.bidStrategyName, Validators.required),
      bidValue: new FormControl(initialBasicinfo.bidValue, Validators.required),
      budget: new FormControl(initialBasicinfo.budget, Validators.required),
    });

    this.getFormDataFromStore();
  }

  getFormDataFromStore() {
    this.store.select('state', 'advertiser', 'lastEditedCampaign', 'basicInformation')
      .subscribe((lastEditedCampaign) => {
        this.campaignBasicInfoForm.patchValue(lastEditedCampaign);
        this.dateStart.setValue(moment(lastEditedCampaign.dateStart));

        if (lastEditedCampaign.dateEnd) {
          this.dateEnd.setValue(moment(lastEditedCampaign.dateEnd));
        }
      });
  }
}
