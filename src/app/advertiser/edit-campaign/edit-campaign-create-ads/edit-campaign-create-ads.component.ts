import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../../advertiser-guard.service';

@Component({
  selector: 'app-edit-campaign-create-ads',
  templateUrl: './edit-campaign-create-ads.component.html',
  styleUrls: ['./edit-campaign-create-ads.component.scss'],
})
export class EditCampaignCreateAdsComponent implements CanComponentDeactivate {
  panelOpenState = false;
  changesSaved = false;

  constructor(private router: Router) {}

  saveCampaignAds(isDraft) {
    this.changesSaved = true;

    if (!isDraft) {
      this.router.navigate(['/advertiser/create-campaign/summary'], {queryParams: { step: 4 } });
    }
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.changesSaved) {
      return confirm('Do you want to discard changes');
    }
    return true;
  }
}
