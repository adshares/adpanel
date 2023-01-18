import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { AdvertiserService } from 'advertiser/advertiser.service';
import { fadeAnimation } from 'common/animations/fade.animation';
import { AppState } from 'models/app-state.model';
import { ClearLastEditedCampaign, SaveCampaignTargeting } from 'store/advertiser/advertiser.actions';
import { parseTargetingOptionsToArray, processTargeting } from 'common/components/targeting/targeting.helpers';
import { CampaignsConfig } from 'models/campaign.model';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';

@Component({
  selector: 'app-edit-campaign',
  templateUrl: './edit-campaign.component.html',
  styleUrls: ['./edit-campaign.component.scss'],
  animations: [fadeAnimation],
})
export class EditCampaignComponent extends HandleSubscriptionComponent implements OnInit, OnDestroy {
  getRouterOutletState = outlet => (outlet.isActivated ? outlet.activatedRoute : '');
  isEditMode: boolean;
  campaignsConfig: CampaignsConfig;

  constructor(
    private advertiserService: AdvertiserService,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.campaignsConfig = this.route.snapshot.data.campaignsConfig;
    this.isEditMode = !!this.router.url.match('/edit-campaign/');

    const lastEditedCampaignSubscription = this.store
      .select('state', 'advertiser', 'lastEditedCampaign')
      .pipe(take(1))
      .subscribe(campaign => {
        if (!campaign.targetingArray) {
          const targetingSubscription = this.advertiserService
            .getMedium(campaign.basicInformation.medium, campaign.basicInformation.vendor)
            .pipe(take(1))
            .subscribe(medium => {
              const targetingOptions = processTargeting(medium);
              this.store.dispatch(
                new SaveCampaignTargeting(parseTargetingOptionsToArray(campaign.targeting, targetingOptions))
              );
            });
          this.subscriptions.push(targetingSubscription);
        }
      });
    this.subscriptions.push(lastEditedCampaignSubscription);
  }

  ngOnDestroy() {
    if (this.isEditMode) {
      this.store.dispatch(new ClearLastEditedCampaign());
    }
  }
}
