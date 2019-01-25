import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/first';

import {AppState} from 'models/app-state.model';
import {Campaign} from 'models/campaign.model';
import {campaignStatusesEnum} from 'models/enum/campaign.enum';
import {AdvertiserService} from 'advertiser/advertiser.service';
import {AssetHelpersService} from 'common/asset-helpers.service';
import {adStatusesEnum} from 'models/enum/ad.enum';
import * as advertiserActions from 'store/advertiser/advertiser.actions';
import {HandleSubscription} from 'common/handle-subscription';
import {TargetingOption} from 'models/targeting-option.model';
import {cloneDeep} from 'common/utilities/helpers';
import {ErrorResponseDialogComponent} from "common/dialog/error-response-dialog/error-response-dialog.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-edit-campaign-summary',
  templateUrl: './edit-campaign-summary.component.html',
  styleUrls: ['./edit-campaign-summary.component.scss']
})
export class EditCampaignSummaryComponent extends HandleSubscription implements OnInit {
  campaign: Campaign;
  currentTooltipIndex: number;
  targetingOptionsToAdd: TargetingOption[];
  targetingOptionsToExclude: TargetingOption[];

  tooltipActive = false;

  constructor(
    private store: Store<AppState>,
    private advertiserService: AdvertiserService,
    private assetHelpers: AssetHelpersService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    const lastCampaignSubscription = this.store.select('state', 'advertiser', 'lastEditedCampaign')
      .subscribe((campaign: Campaign) => {
        this.assetHelpers.redirectIfNameNotFilled(campaign);
        this.campaign = campaign;
      });
    this.subscriptions.push(lastCampaignSubscription);

    this.targetingOptionsToAdd = cloneDeep(this.route.parent.snapshot.data.targetingOptions);
    this.targetingOptionsToExclude = cloneDeep(this.route.parent.snapshot.data.targetingOptions);
  }

  saveCampaign(isDraft): void {
    if (!isDraft) {
      this.campaign.basicInformation.status = campaignStatusesEnum.ACTIVE;
      this.campaign.ads.forEach((ad) => ad.status = adStatusesEnum.ACTIVE);
    }

    if (this.isEditMode()) {
      this.editCampaign();
    } else {
      this.createNewCampaign();
    }
  }

  private isEditMode(): boolean {
    return this.campaign.id && this.campaign.id !== 0;
  }

  private editCampaign(): void {
    this.store.dispatch(new advertiserActions.UpdateCampaign(this.campaign));
  }

  private createNewCampaign(): void {
    this.advertiserService.saveCampaign(this.campaign).subscribe(
      () => {
        this.store.dispatch(new advertiserActions.AddCampaignToCampaignsSuccess(this.campaign));
        this.store.dispatch(new advertiserActions.ClearLastEditedCampaign({}));
        this.router.navigate(['/advertiser', 'dashboard']);
      },

      (err) => {
        this.dialog.open(ErrorResponseDialogComponent, {
          data: {
            title: 'Ups! Something went wrong...',
            message: `We weren\'t able to add a new campaign due to this error:  ${err}. Please try again later.`,
          }
        });
      }
    );
  }

  toggleTooltip(state, adIndex) {
    this.tooltipActive = state;
    this.currentTooltipIndex = adIndex;
  }
}
