import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { Campaign } from 'models/campaign.model';
import { AppState } from 'models/app-state.model';
import { ChartComponent } from 'common/components/chart/chart.component';
import { ChartService } from 'common/chart.service';
import { ChartFilterSettings } from 'models/chart/chart-filter-settings.model';
import { ChartData } from 'models/chart/chart-data.model';
import { AssetTargeting } from 'models/targeting-option.model';
import { campaignStatusesEnum } from 'models/enum/campaign.enum';
import { createInitialArray, downloadCSVFile } from 'common/utilities/helpers';
import { parseTargetingOptionsToArray } from 'common/components/targeting/targeting.helpers';
import { HandleSubscription } from 'common/handle-subscription';
import { MatDialog } from '@angular/material';
import { UserConfirmResponseDialogComponent } from 'common/dialog/user-confirm-response-dialog/user-confirm-response-dialog.component';
import { DeleteCampaign, LoadCampaignTotals, UpdateCampaignStatus, } from 'store/advertiser/advertiser.actions';
import { AdvertiserService } from 'advertiser/advertiser.service';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss']
})
export class CampaignDetailsComponent extends HandleSubscription implements OnInit, OnDestroy {
  @ViewChild(ChartComponent) appChartRef: ChartComponent;
  campaign: Campaign;
  campaignStatusesEnum = campaignStatusesEnum;
  barChartValue: number;
  barChartDifference: number;
  barChartDifferenceInPercentage: number;
  barChartLabels: string[] = [];
  barChartData: ChartData[] = createInitialArray([{data: []}], 1);
  targeting: AssetTargeting = {
    requires: [],
    excludes: []
  };
  targetingOptions: AssetTargeting;
  currentChartFilterSettings: ChartFilterSettings;
  currentCampaignStatus: string;
  faExclamation = faExclamation;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private advertiserService: AdvertiserService,
    private chartService: ChartService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    const id = this.route.snapshot.data.campaign.id;
    const chartFilterSubscription = this.store.select('state', 'common', 'chartFilterSettings')
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.currentChartFilterSettings = chartFilterSettings;
        this.getChartData(this.currentChartFilterSettings, id)
      });

    const campaignSubscription = this.store.select('state', 'advertiser', 'campaigns')
      .subscribe((campaigns: Campaign[]) => {
        if (!campaigns || !campaigns.length) return;

        this.campaign = campaigns.find(el => {
          return el.id === id;
        });

        if (this.campaign) {
          this.currentCampaignStatus = campaignStatusesEnum[this.campaign.basicInformation.status].toLowerCase();
          this.getTargeting();
        }
      });

    this.subscriptions.push(chartFilterSubscription, campaignSubscription);
  }

  deleteCampaign() {
    const dialogRef = this.dialog.open(UserConfirmResponseDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this campaign?',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.store.dispatch(new DeleteCampaign(this.campaign.id));
        }
      }
    );
  }

  getTargeting() {
    this.campaign.targeting = {
      requires: this.campaign.targeting.requires || [],
      excludes: this.campaign.targeting.excludes || [],
    };

    if (this.targeting.requires.length || this.targeting.excludes.length || !this.campaign) return;
    if (Array.isArray(this.campaign.targeting.requires) && Array.isArray(this.campaign.targeting.excludes)) {
      this.targeting = this.campaign.targeting as AssetTargeting;
    } else {
      this.targetingOptions = this.route.snapshot.data.targetingOptions;
      this.targeting = parseTargetingOptionsToArray(this.campaign.targeting, this.targetingOptions);
    }
  }

  getChartData(chartFilterSettings, id) {
    this.barChartData[0].data = [];
    const chartDataSubscription = this.chartService
      .getAssetChartData(
        chartFilterSettings.currentFrom,
        chartFilterSettings.currentTo,
        chartFilterSettings.currentFrequency,
        chartFilterSettings.currentSeries.value,
        'campaigns',
        id,
      )
      .subscribe(data => {
        this.barChartData[0].data = data.values;
        this.barChartData[0].currentSeries = this.currentChartFilterSettings.currentSeries.label;
        this.barChartLabels = data.timestamps.map((item) => moment(item).format());
        this.barChartValue = data.total;
        this.barChartDifference = data.difference;
        this.barChartDifferenceInPercentage = data.differenceInPercentage;
      });

    this.store.dispatch(new LoadCampaignTotals({
      from: chartFilterSettings.currentFrom,
      to: chartFilterSettings.currentTo,
      id
    }));
    this.subscriptions.push(chartDataSubscription);
  }

  navigateToCampaignEdition(path: string, step: number): void {
    this.router.navigate(
      ['/advertiser', 'edit-campaign', this.campaign.id, path],
      {queryParams: {step}}
    );
  }

  onCampaignStatusChange() {
    let status;
    if (this.canActivateCampaign) {
      status = this.campaignStatusesEnum.ACTIVE;
    } else {
      status = this.campaignStatusesEnum.INACTIVE;
    }

    this.store.dispatch(new UpdateCampaignStatus(
      {id: this.campaign.id, status}));
  }

  get canActivateCampaign(): boolean {
    return (this.currentCampaignStatus === this.campaignStatusesEnum[this.campaignStatusesEnum.DRAFT].toLowerCase()) ||
      (this.currentCampaignStatus === this.campaignStatusesEnum[this.campaignStatusesEnum.SUSPENDED].toLowerCase()) ||
      (this.currentCampaignStatus === this.campaignStatusesEnum[this.campaignStatusesEnum.INACTIVE].toLowerCase());
  }

  get statusButtonLabel(): string {
    return this.canActivateCampaign ? 'Activate' : 'Deactivate'
  }

  downloadReport() {
    const settings = this.currentChartFilterSettings;
    this.advertiserService.report(settings.currentFrom, settings.currentTo, this.campaign.id)
      .subscribe((data) => {
        downloadCSVFile(data, settings.currentFrom, settings.currentTo);
      });
  }
}
