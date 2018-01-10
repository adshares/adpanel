import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HandleLeaveEditProcess } from '../../../common/handle-leave-edit-process';

@Component({
  selector: 'app-edit-campaign-create-ads',
  templateUrl: './edit-campaign-create-ads.component.html',
  styleUrls: ['./edit-campaign-create-ads.component.scss'],
})
export class EditCampaignCreateAdsComponent extends HandleLeaveEditProcess {
  panelOpenState = false;
  changesSaved = false;

  constructor(private router: Router) {
    super();
  }

  saveCampaignAds(isDraft) {
    this.changesSaved = true;

    if (!isDraft) {
      this.router.navigate(['/advertiser/create-campaign/summary'], {queryParams: { step: 4 } });
    }
  }
}
