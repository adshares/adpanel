import { Component, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as _moment from 'moment';

import { AppState } from '../../../models/app-state.model';
import { campaignStatusesEnum } from '../../../models/enum/campaign.enum'
import * as AdvertiserActions from '../../../store/advertiser/advertiser.action';
import { HandleLeaveEditProcess } from '../../../common/handle-leave-edit-process';

const moment = _moment;

@Component({
  selector: 'app-edit-campaign-basic-information',
  templateUrl: './edit-campaign-basic-information.component.html',
  styleUrls: ['./edit-campaign-basic-information.component.scss']
})
export class EditCampaignBasicInformationComponent extends HandleLeaveEditProcess implements OnInit {
  campaignBasicInforForm: FormGroup;
  campaignBasicInformationSubmitted = false;
  dateStart = new FormControl();
  dateEnd = new FormControl();
  minDate = moment().format('L');
  maxDate = moment().add(1, 'year').format('L');

  goesToSummary: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    super();
    this.route.queryParams.subscribe(params => this.goesToSummary = params.summary);
  }

  ngOnInit() {
    this.createForm();
  }

  saveCampaignBasicInformation() {
    this.campaignBasicInformationSubmitted = true;
    if (!this.campaignBasicInforForm.valid || !this.dateStart) {
      return;
    }

    const campaignBasicInfoValue = this.campaignBasicInforForm.value;
    const link = this.goesToSummary ? '/advertiser/create-campaign/summary' : '/advertiser/create-campaign/additional-targeting';
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

    this.store.dispatch(new AdvertiserActions.SaveCampaignBasicInformation(basicInformation));
    this.changesSaved = true;

    this.router.navigate([link], {queryParams: { step: param } });
  }

  createForm() {
    this.campaignBasicInforForm = new FormGroup({
      name: new FormControl('', Validators.required),
      targetUrl: new FormControl('', Validators.required),
      bidStrategyName: new FormControl('', Validators.required),
      bidValue: new FormControl(0, Validators.required),
      budget: new FormControl(0, Validators.required),
    });

    if (this.goesToSummary) {
      this.getFormDataFromStore();
    }
  }

  getFormDataFromStore() {
    this.store.select('state', 'advertiser', 'lastEditedCampaign', 'basicInformation')
      .subscribe((lastEditedCampaign) => {
        this.campaignBasicInforForm.controls['name'].setValue(lastEditedCampaign.name);
        this.campaignBasicInforForm.controls['targetUrl'].setValue(lastEditedCampaign.targetUrl);
        this.campaignBasicInforForm.controls['bidStrategyName'].setValue(lastEditedCampaign.bidStrategyName);
        this.campaignBasicInforForm.controls['bidValue'].setValue(lastEditedCampaign.bidValue);
        this.campaignBasicInforForm.controls['budget'].setValue(lastEditedCampaign.budget);
        this.dateStart.setValue(moment(lastEditedCampaign.dateStart));

        if (lastEditedCampaign.dateEnd) {
          this.dateEnd.setValue(moment(lastEditedCampaign.dateEnd));
        }
      });
  }
}
