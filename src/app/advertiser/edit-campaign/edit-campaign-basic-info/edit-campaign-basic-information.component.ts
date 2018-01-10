import { Component, ViewChild } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../models/app-state.model';

import * as AdvertiserActions from '../../../store/advertiser/advertiser.action';

import * as _moment from 'moment';
import { HandleLeaveEditProcess } from '../../../common/handle-leave-edit-process';
const moment = _moment;

@Component({
  selector: 'app-edit-campaign-basic-information',
  templateUrl: './edit-campaign-basic-information.component.html',
  styleUrls: ['./edit-campaign-basic-information.component.scss'],
})
export class EditCampaignBasicInformationComponent extends HandleLeaveEditProcess {
  @ViewChild('editCampaignBasicInformationForm') editCampaignBasicInformationForm: NgForm;
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
    this.route.queryParams.subscribe(params => {
      this.goesToSummary = params.summary;
    });
  }

  saveCampaignBasicInformation() {
    if (!this.editCampaignBasicInformationForm.valid) {
      return;
    }

    const id = Math.floor(Math.random() * 100000000) + 10000;
    const basicInformation = {
      id: id,
      status: 'draft',
      name: this.editCampaignBasicInformationForm.value.campaignName,
      targetURL: this.editCampaignBasicInformationForm.value.campaignTargetURL,
      bidStrategy: this.editCampaignBasicInformationForm.value.campaignBidStrategy,
      bidValue: this.editCampaignBasicInformationForm.value.campaignBidValue,
      budget: this.editCampaignBasicInformationForm.value.campaignBudget,
      dateStart: moment(this.dateStart.value._d).format('L'),
      dateEnd: this.dateEnd.value !== null ? moment(this.dateEnd.value._d).format('L') : null
    };

    this.store.dispatch(new AdvertiserActions.SaveCampaignBasicInformation(basicInformation));
    this.changesSaved = true;

    const link = this.goesToSummary ? '/advertiser/create-campaign/summary' : '/advertiser/create-campaign/additional-targeting';
    const param = this.goesToSummary ? 4 : 2;
    this.router.navigate([link], {queryParams: { step: param } });
  }
}
