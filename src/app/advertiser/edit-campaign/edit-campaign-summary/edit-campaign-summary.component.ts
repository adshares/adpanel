import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

import { AppState } from '../../../models/app-state.model';
import { Campaign } from '../../../models/campaign.model';
import { campaignStatusesEnum } from '../../../models/enum/campaign.enum'
import { AdvertiserService } from '../../advertiser.service';

@Component({
  selector: 'app-edit-campaign-summary',
  templateUrl: './edit-campaign-summary.component.html',
  styleUrls: ['./edit-campaign-summary.component.scss']
})
export class EditCampaignSummaryComponent implements OnInit {
    campaign: Campaign;

    constructor(
      private store: Store<AppState>,
      private advertiserService: AdvertiserService,
      private router: Router
    ) { }

    ngOnInit() {
      this.store.select('state', 'advertiser', 'lastEditedCampaign')
        .subscribe((campaign: Campaign) => this.campaign = campaign);
    }

    saveCampaign(isDraft) {
      if (!isDraft) {
        this.campaign.basicInformation.status = campaignStatusesEnum.ACTIVE;
      }

      this.advertiserService.saveCampaign(this.campaign)
        .subscribe(() => {
          this.router.navigate(['/advertiser', 'dashboard']);
        });
    }
}
