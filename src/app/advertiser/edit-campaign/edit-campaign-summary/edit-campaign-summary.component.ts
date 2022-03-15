import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/first';

import { AppState } from 'models/app-state.model';
import { Campaign } from 'models/campaign.model';
import { campaignStatusesEnum } from 'models/enum/campaign.enum';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { AssetHelpersService } from 'common/asset-helpers.service';
import { processTargeting } from 'common/components/targeting/targeting.helpers';
import { adStatusesEnum } from 'models/enum/ad.enum';
import { AddCampaignToCampaigns } from 'store/advertiser/advertiser.actions';
import { HandleSubscription } from 'common/handle-subscription';
import { TargetingOption } from 'models/targeting-option.model';
import { cloneDeep } from 'common/utilities/helpers';

@Component({
  selector: 'app-edit-campaign-summary',
  templateUrl: './edit-campaign-summary.component.html',
  styleUrls: ['./edit-campaign-summary.component.scss']
})
export class EditCampaignSummaryComponent extends HandleSubscription implements OnInit {
  campaign: Campaign;
  targetingOptionsToAdd: TargetingOption[] = [];
  targetingOptionsToExclude: TargetingOption[] = [];

  constructor(
    private store: Store<AppState>,
    private advertiserService: AdvertiserService,
    private assetHelpers: AssetHelpersService,
  ) {
    super();
  }

  ngOnInit(): void {
    const lastCampaignSubscription = this.store.select('state', 'advertiser', 'lastEditedCampaign')
      .first()
      .subscribe(campaign => {
        this.assetHelpers.redirectIfNameNotFilled(campaign);
        this.campaign = campaign;
        const targetingSubscription = this.advertiserService.getMedium(campaign.basicInformation.medium, campaign.basicInformation.vendor)
          .take(1)
          .subscribe(medium => {
            this.targetingOptionsToAdd = processTargeting(medium)
            this.targetingOptionsToExclude = cloneDeep(this.targetingOptionsToAdd)
          })
        this.subscriptions.push(targetingSubscription)
      });
    this.subscriptions.push(lastCampaignSubscription);
  }

  saveCampaign(isDraft): void {
    if (!isDraft) {
      this.campaign.basicInformation.status = campaignStatusesEnum.ACTIVE;
      this.campaign.ads.forEach((ad) => ad.status = adStatusesEnum.ACTIVE);
    }
    this.store.dispatch(new AddCampaignToCampaigns(this.campaign));
  }
}
