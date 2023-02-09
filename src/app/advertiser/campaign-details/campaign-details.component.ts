import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Campaign,
  CampaignConversionStatistics,
  CampaignConversionStatisticsTableItem,
  CampaignsConfig,
} from 'models/campaign.model';
import { AppState } from 'models/app-state.model';
import { BidStrategyService } from 'common/bid-strategy.service';
import { ChartComponent } from 'common/components/chart/chart.component';
import { mapDatesToChartLabels } from 'common/components/chart/chart-settings/chart-settings.helpers';
import { ChartService } from 'common/chart.service';
import { ChartFilterSettings } from 'models/chart/chart-filter-settings.model';
import { AssetTargeting, TargetingOption } from 'models/targeting-option.model';
import { campaignStatusesEnum } from 'models/enum/campaign.enum';
import { cloneDeep, createInitialDataSet, validCampaignBudget } from 'common/utilities/helpers';
import { parseTargetingOptionsToArray, processTargeting } from 'common/components/targeting/targeting.helpers';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { MatDialog } from '@angular/material/dialog';
import { UserConfirmResponseDialogComponent } from 'common/dialog/user-confirm-response-dialog/user-confirm-response-dialog.component';
import {
  DeleteCampaign,
  LoadCampaignTotals,
  UpdateCampaignStatus,
  CloneCampaign,
} from 'store/advertiser/advertiser.actions';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { User } from 'models/user.model';
import { appSettings } from 'app-settings';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { RequestReport } from 'store/common/common.actions';
import { reportType } from 'models/enum/user.enum';
import { faPlusCircle, faEdit, faArrowLeft, faExclamation } from '@fortawesome/free-solid-svg-icons';
import { faCalendar, faTrashAlt, faCopy } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss'],
})
export class CampaignDetailsComponent extends HandleSubscriptionComponent implements OnInit, OnDestroy {
  @ViewChild(ChartComponent) appChartRef: ChartComponent;
  campaignsConfig: CampaignsConfig;
  dataLoaded: boolean = false;
  campaign: Campaign;
  user: User;
  conversionTableItems: CampaignConversionStatisticsTableItem[] = [];
  conversionsStatistics: CampaignConversionStatistics[] = [];
  campaignStatusesEnum = campaignStatusesEnum;
  barChartValue: number;
  barChartDifference: number;
  barChartDifferenceInPercentage: number;
  barChartLabels: string[] = [];
  barChartData = createInitialDataSet();
  targeting: AssetTargeting = {
    requires: [],
    excludes: [],
  };
  targetingOptions: TargetingOption[];
  currentChartFilterSettings: ChartFilterSettings;
  currentCampaignStatus: string;
  budgetInfo: string;
  isDefaultBidStrategy: boolean = false;
  isTaxonomyMissing = false;
  mediumLabel: string;
  faPlusCircle = faPlusCircle;
  faTrash = faTrashAlt;
  faEdit = faEdit;
  faCalendar = faCalendar;
  faArrowLeft = faArrowLeft;
  faCopy = faCopy;
  faExclamation = faExclamation;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private advertiserService: AdvertiserService,
    private bidStrategyService: BidStrategyService,
    private chartService: ChartService,
    private dialog: MatDialog
  ) {
    super();
  }

  get canActivateCampaign(): boolean {
    return (
      this.currentCampaignStatus === this.campaignStatusesEnum[this.campaignStatusesEnum.DRAFT].toLowerCase() ||
      this.currentCampaignStatus === this.campaignStatusesEnum[this.campaignStatusesEnum.SUSPENDED].toLowerCase() ||
      this.currentCampaignStatus === this.campaignStatusesEnum[this.campaignStatusesEnum.INACTIVE].toLowerCase()
    );
  }

  get statusButtonLabel(): string {
    return this.canActivateCampaign ? 'Activate' : 'Deactivate';
  }

  ngOnInit(): void {
    this.campaignsConfig = this.route.snapshot.data.campaignsConfig;
    const id = this.route.snapshot.data.campaign.id;

    this.store
      .select('state', 'common', 'chartFilterSettings')
      .pipe(take(1))
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.getChartData(chartFilterSettings, id);
      });

    const chartFilterSubscription = this.store
      .select('state', 'common', 'chartFilterSettings')
      .subscribe((chartFilterSettings: ChartFilterSettings) => (this.currentChartFilterSettings = chartFilterSettings));

    const campaignSubscription = this.store
      .select('state', 'advertiser', 'campaigns')
      .subscribe((campaigns: Campaign[]) => {
        if (!campaigns || !campaigns.length) return;
        const selectedCampaign = campaigns.find(campaign => campaign.id === id);

        if (undefined !== selectedCampaign) {
          this.campaign = cloneDeep(selectedCampaign);
          this.currentCampaignStatus = campaignStatusesEnum[this.campaign.basicInformation.status].toLowerCase();
          this.updateTargeting();
          this.bidStrategyService
            .getBidStrategyUuidDefault(this.campaign.basicInformation.medium, this.campaign.basicInformation.vendor)
            .subscribe(uuid => {
              this.isDefaultBidStrategy = this.campaign.bidStrategy.uuid === uuid;
            });
          this.prepareMediumLabel(this.campaign);
        }
        this.updateBudgetInfo();
        this.updateConversionTableItems();
      });

    const dataLoadedSubscription = this.store
      .select('state', 'advertiser', 'dataLoaded')
      .subscribe((dataLoaded: boolean) => (this.dataLoaded = dataLoaded));

    const campaignsConfigSubscription = this.store
      .select('state', 'advertiser', 'campaignsConfig')
      .subscribe((campaignsConfig: CampaignsConfig) => {
        this.campaignsConfig = campaignsConfig;
        this.updateBudgetInfo();
      });

    const userSubscription = this.store.select('state', 'user', 'data').subscribe((user: User) => {
      this.user = user;
      this.updateBudgetInfo();
    });

    const refreshSubscription = timer(
      appSettings.AUTOMATIC_REFRESH_INTERVAL,
      appSettings.AUTOMATIC_REFRESH_INTERVAL
    ).subscribe(() => {
      if (this.currentChartFilterSettings && this.campaign && this.campaign.id) {
        this.getChartData(this.currentChartFilterSettings, this.campaign.id, false);
      }
    });

    this.subscriptions.push(
      chartFilterSubscription,
      campaignSubscription,
      dataLoadedSubscription,
      campaignsConfigSubscription,
      userSubscription,
      refreshSubscription
    );
  }

  private prepareMediumLabel(campaign: Campaign): void {
    const medium = this.route.snapshot.data.media[campaign.basicInformation.medium];
    if (medium) {
      if (campaign.basicInformation.vendor === null) {
        this.mediumLabel = `${medium} campaign`;
        return;
      }
      this.advertiserService.getMediumVendors(campaign.basicInformation.medium).subscribe(vendors => {
        const vendor = vendors[campaign.basicInformation.vendor];
        this.mediumLabel = vendor ? `${medium} campaign in ${vendor}` : `${medium} campaign`;
      });
    }
  }

  updateBudgetInfo(): void {
    this.budgetInfo = null;
    if (!this.campaignsConfig || !this.campaign || !this.user) {
      return;
    }
    const errors = validCampaignBudget(this.campaignsConfig, this.campaign, this.user);
    if (errors.length > 0) {
      this.budgetInfo = errors.join(' ');
    }
  }

  cloneCampaign(): void {
    const dialogRef = this.dialog.open(UserConfirmResponseDialogComponent, {
      data: {
        message: 'Are you sure you want to clone this campaign?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new CloneCampaign(this.campaign.id));
      }
    });
  }

  deleteCampaign(): void {
    const dialogRef = this.dialog.open(UserConfirmResponseDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this campaign?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new DeleteCampaign(this.campaign.id));
      }
    });
  }

  updateTargeting(): void {
    this.campaign.targeting = {
      requires: this.campaign.targeting.requires || [],
      excludes: this.campaign.targeting.excludes || [],
    };

    if (this.targeting.requires.length || this.targeting.excludes.length) {
      return;
    }
    if (Array.isArray(this.campaign.targeting.requires) && Array.isArray(this.campaign.targeting.excludes)) {
      this.targeting = this.campaign.targeting as AssetTargeting;
    } else {
      this.advertiserService
        .getMedium(this.campaign.basicInformation.medium, this.campaign.basicInformation.vendor)
        .pipe(take(1))
        .subscribe(
          medium => {
            this.targetingOptions = processTargeting(medium);
            this.targeting = parseTargetingOptionsToArray(this.campaign.targeting, this.targetingOptions);
          },
          () => (this.isTaxonomyMissing = true)
        );
    }
  }

  getChartData(chartFilterSettings, campaignId, reload: boolean = true) {
    if (reload) {
      this.barChartData[0].data = [];
    }

    this.chartService
      .getAssetChartData(
        chartFilterSettings.currentFrom,
        chartFilterSettings.currentTo,
        chartFilterSettings.currentFrequency,
        chartFilterSettings.currentSeries.value,
        'campaigns',
        campaignId
      )
      .pipe(take(1))
      .subscribe(data => {
        this.barChartData[0].data = data.values;
        this.barChartData[0].label = chartFilterSettings.currentSeries.label;
        this.barChartLabels = mapDatesToChartLabels(data.timestamps);
        this.barChartValue = data.total;
        this.barChartDifference = data.difference;
        this.barChartDifferenceInPercentage = data.differenceInPercentage;
      });

    this.advertiserService
      .getCampaignConversionsStatistics(chartFilterSettings.currentFrom, chartFilterSettings.currentTo, campaignId)
      .pipe(take(1))
      .subscribe(
        data => {
          this.conversionsStatistics = data;
          this.updateConversionTableItems();
        },
        () => {
          this.conversionsStatistics = [];
        }
      );

    this.store.dispatch(
      new LoadCampaignTotals({
        from: chartFilterSettings.currentFrom,
        to: chartFilterSettings.currentTo,
        id: campaignId,
      })
    );
  }

  navigateToCampaignEdition(path: string): void {
    this.router.navigate(['/advertiser', 'edit-campaign', this.campaign.id, path]);
  }

  onCampaignStatusChange() {
    let status;
    if (this.canActivateCampaign) {
      status = this.campaignStatusesEnum.ACTIVE;
    } else {
      status = this.campaignStatusesEnum.INACTIVE;
    }

    this.store.dispatch(new UpdateCampaignStatus({ id: this.campaign.id, status }));
  }

  downloadReport() {
    this.store.dispatch(
      new RequestReport({
        type: reportType.CAMPAIGNS,
        dateStart: this.currentChartFilterSettings.currentFrom,
        dateEnd: this.currentChartFilterSettings.currentTo,
        id: this.campaign.id,
      })
    );
  }

  updateConversionTableItems(): void {
    if (!this.campaign || !this.campaign.conversions) {
      this.conversionTableItems = [];

      return;
    }

    const campaignId = this.campaign.id;
    const statistics = this.conversionsStatistics;

    this.conversionTableItems = this.campaign.conversions.map(function (element) {
      const statistic = statistics.find(item => campaignId === item.campaignId && element.uuid === item.uuid);
      const cost = statistic ? statistic.cost : 0;
      const occurrences = statistic ? statistic.occurrences : 0;

      return <CampaignConversionStatisticsTableItem>{
        name: element.name,
        eventType: element.eventType,
        cost,
        occurrences,
      };
    });
  }
}
