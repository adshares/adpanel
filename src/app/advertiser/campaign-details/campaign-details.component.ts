import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import * as moment from 'moment';

import {Campaign} from 'models/campaign.model';
import {AppState} from 'models/app-state.model';
import {AdvertiserService} from 'advertiser/advertiser.service';
import {ChartComponent} from 'common/components/chart/chart.component';
import {ChartService} from 'common/chart.service';
import {ChartFilterSettings} from 'models/chart/chart-filter-settings.model';
import {ChartData} from 'models/chart/chart-data.model';
import {AssetTargeting} from "models/targeting-option.model";
import {campaignStatusesEnum} from 'models/enum/campaign.enum';
import {classificationStatusesEnum} from 'models/enum/classification.enum';
import {createInitialArray, enumToArray} from 'common/utilities/helpers';
import {parseTargetingOptionsToArray} from "common/components/targeting/targeting.helpers";
import {HandleSubscription} from 'common/handle-subscription';
import {MatDialog} from "@angular/material";
import {UserConfirmResponseDialogComponent} from "common/dialog/user-confirm-response-dialog/user-confirm-response-dialog.component";
import * as advertiserActions from 'store/advertiser/advertiser.actions';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss']
})
export class CampaignDetailsComponent extends HandleSubscription implements OnInit, OnDestroy {
  @ViewChild(ChartComponent) appChartRef: ChartComponent;

  campaign: Campaign;
  campaignStatusesEnum = campaignStatusesEnum;
  campaignStatusesEnumArray = enumToArray(campaignStatusesEnum);
  classificationStatusesEnum = classificationStatusesEnum;
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
        message: 'Do you confirm deletion?',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.store.dispatch(new advertiserActions.DeleteCampaign(this.campaign.id));
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
        chartFilterSettings.currentSeries,
        'campaigns',
        id,
      )
      .subscribe(data => {
        this.barChartData[0].data = data.values;
        this.barChartLabels = data.timestamps.map((item) => moment(item).format());
        this.barChartValue = data.total;
        this.barChartDifference = data.difference;
        this.barChartDifferenceInPercentage = data.differenceInPercentage;
      });

    this.subscriptions.push(chartDataSubscription);
  }

  navigateToCampaignEdition(path: string, step: number): void {
    this.store.dispatch(new advertiserActions.SetLastEditedCampaign(this.campaign));
    this.router.navigate(
      ['/advertiser', 'edit-campaign', path],
      {queryParams: {step}}
    );
  }

  onCampaignStatusChange() {
    if (this.canActivateCampaign) {
      this.currentCampaignStatus = 'active';
    } else {
      this.currentCampaignStatus = 'inactive';
    }
    this.campaign.basicInformation.status =
      this.campaignStatusesEnumArray.findIndex(el => el === this.currentCampaignStatus);
    this.store.dispatch(new advertiserActions.UpdateCampaignStatus(
      {id: this.campaign.id, status: this.campaign.basicInformation.status}));
  }

  get canActivateCampaign(): boolean {
    return (this.currentCampaignStatus === this.campaignStatusesEnum[this.campaignStatusesEnum.DRAFT].toLowerCase()) ||
      (this.currentCampaignStatus === this.campaignStatusesEnum[this.campaignStatusesEnum.SUSPENDED].toLowerCase()) ||
      (this.currentCampaignStatus === this.campaignStatusesEnum[this.campaignStatusesEnum.INACTIVE].toLowerCase());
  }

  get statusButtonLabel(): string {
    return this.canActivateCampaign ? 'Activate' : 'Deactivate'
  }

  get classificationLabel() {
    if (!this.campaign) return;
    if (this.campaign.classificationStatus === this.classificationStatusesEnum.PROCESSING) {
      return 'Processing';
    }

    if (this.campaign.classificationTags === null) {
      return '';
    }
    return `[${this.campaign.classificationTags}]`;
  }

  onCampaignClassificationStatusChange(status) {
    if (status === 0) {
      this.advertiserService
        .classifyCampaign(this.campaign.id)
        .subscribe(() => {
        });
    } else {
      this.advertiserService
        .removeClassifyCampaign(this.campaign.id)
        .subscribe(() => {
        });
    }
  }

  get isClassificationChecked() {
    return this.campaign && this.campaign.classificationStatus !== this.classificationStatusesEnum.DISABLED;
  }
}
