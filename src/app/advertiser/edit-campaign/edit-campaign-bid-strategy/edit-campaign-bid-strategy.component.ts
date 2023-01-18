import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { AppState } from 'models/app-state.model';
import { BidStrategy, Campaign, CampaignsConfig } from 'models/campaign.model';
import {
  ClearLastEditedCampaign,
  LoadCampaignsConfig,
  SaveConversion,
  UPDATE_CAMPAIGN_FAILURE,
  UPDATE_CAMPAIGN_SUCCESS,
} from 'store/advertiser/advertiser.actions';
import { ShowDialogOnError, ShowSuccessSnackbar } from 'store/common/common.actions';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { BidStrategyService } from 'common/bid-strategy.service';
import { SAVE_SUCCESS } from 'common/utilities/messages';

@Component({
  selector: 'app-edit-campaign-bid-strategy',
  templateUrl: './edit-campaign-bid-strategy.component.html',
  styleUrls: ['./edit-campaign-bid-strategy.component.scss'],
})
export class EditCampaignBidStrategyComponent extends HandleSubscriptionComponent implements OnInit {
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
    private action$: Actions
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(new LoadCampaignsConfig());
    this.fetchBidStrategies();
  }

  fetchBidStrategies(): void {
    this.campaign = this.route.snapshot.parent.data.campaign;
    this.bidStrategyService
      .getBidStrategies(this.campaign.basicInformation.medium, this.campaign.basicInformation.vendor, true)
      .subscribe(
        bidStrategies => {
          this.bidStrategies = bidStrategies;
          const bidStrategyUuid = this.campaign.bidStrategy.uuid;
          if (
            bidStrategyUuid &&
            -1 !== this.bidStrategies.findIndex(bidStrategy => bidStrategy.uuid === bidStrategyUuid)
          ) {
            this.bidStrategyUuidSelected = bidStrategyUuid;
          }
          this.isLoading = false;
        },
        error => {
          const status = error.status ? error.status : 0;
          this.store.dispatch(new ShowDialogOnError(`Reload the page to load data. Error code (${status})`));
          this.isLoading = false;
        }
      );
  }

  onBidStrategySelect(): void {
    this.submitted = true;

    const bigStrategySelected = this.bidStrategies.find(
      bidStrategy => bidStrategy.uuid === this.bidStrategyUuidSelected
    );

    this.campaign = {
      ...this.campaign,
      bidStrategy: {
        name: bigStrategySelected.name,
        uuid: this.bidStrategyUuidSelected,
      },
    };
    this.store.dispatch(new SaveConversion(this.campaign));

    this.action$.pipe(ofType(UPDATE_CAMPAIGN_SUCCESS, UPDATE_CAMPAIGN_FAILURE), first()).subscribe((action: Action) => {
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
