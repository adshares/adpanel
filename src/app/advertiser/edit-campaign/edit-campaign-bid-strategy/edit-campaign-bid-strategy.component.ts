import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import { BidStrategy, Campaign, CampaignsConfig } from 'models/campaign.model';
import {
  ClearLastEditedCampaign,
  LoadCampaignsConfig,
  SaveConversion,
  UPDATE_CAMPAIGN_FAILURE,
  UPDATE_CAMPAIGN_SUCCESS
} from 'store/advertiser/advertiser.actions';
import { ShowDialogOnError, ShowSuccessSnackbar } from 'store/common/common.actions';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { HandleSubscription } from 'common/handle-subscription';
import { BidStrategyService } from 'common/bid-strategy.service';
import { SAVE_SUCCESS } from 'common/utilities/messages';

@Component({
  selector: 'app-edit-campaign-bid-strategy',
  templateUrl: './edit-campaign-bid-strategy.component.html',
  styleUrls: ['./edit-campaign-bid-strategy.component.scss']
})
export class EditCampaignBidStrategyComponent extends HandleSubscription implements OnInit {
  campaignsConfig: CampaignsConfig;
  campaign: Campaign;
  submitted: boolean = false;
  bidStrategies: BidStrategy[] = [];
  bidStrategyUuidSelected: string | null = null;
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private advertiserService: AdvertiserService,
    private bidStrategyService: BidStrategyService,
    private dialog: MatDialog,
    private action$: Actions,
  ) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(new LoadCampaignsConfig());
    this.fetchBidStrategies();
  }

  fetchBidStrategies(): void {
    this.bidStrategyService.getBidStrategies(true).subscribe(
      (bidStrategies) => {
        this.bidStrategies = bidStrategies;
        this.getCampaignFromStore();
      },
      (error) => {
        const status = error.status ? error.status : 0;
        this.store.dispatch(new ShowDialogOnError(`Reload the page to load data. Error code (${status})`));
        this.isLoading = false;
      });
  }

  getCampaignFromStore(): void {
    const subscription = this.store.select('state', 'advertiser', 'lastEditedCampaign')
      .first()
      .subscribe((lastEditedCampaign: Campaign) => {
        this.campaign = lastEditedCampaign;
        if (this.campaign.bidStrategyUuid && (-1 !== this.bidStrategies.findIndex((bidStrategy) => bidStrategy.uuid === this.campaign.bidStrategyUuid))) {
          this.bidStrategyUuidSelected = this.campaign.bidStrategyUuid;
        }
        this.isLoading = false;
      });

    this.subscriptions.push(subscription);
  }

  onBidStrategySelect(): void {
    this.submitted = true;

    this.campaign = {
      ...this.campaign,
      bidStrategyUuid: this.bidStrategyUuidSelected,
    };
    this.store.dispatch(new SaveConversion(this.campaign));

    this.action$.ofType(
      UPDATE_CAMPAIGN_SUCCESS,
      UPDATE_CAMPAIGN_FAILURE
    ).first().subscribe((action) => {
      this.submitted = false;
      if (UPDATE_CAMPAIGN_SUCCESS === action.type) {
        this.store.dispatch(new ShowSuccessSnackbar(SAVE_SUCCESS));
      } else {
        this.bidStrategyUuidSelected = null;
      }
    });
  }

  onStepBack(): void {
    this.store.dispatch(new ClearLastEditedCampaign());
    this.router.navigate(['/advertiser', 'campaign', this.campaign.id]);
  }
}
