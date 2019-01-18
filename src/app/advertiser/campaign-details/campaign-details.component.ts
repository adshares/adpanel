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
import {campaignStatusesEnum} from 'models/enum/campaign.enum';
import {classificationStatusesEnum} from 'models/enum/classification.enum';
import {createInitialArray} from 'common/utilities/helpers';
import {HandleSubscription} from 'common/handle-subscription';
import * as advertiserActions from 'store/advertiser/advertiser.actions';
import {MatDialog} from "@angular/material";
import {ErrorResponseDialogComponent} from "common/dialog/error-response-dialog/error-response-dialog.component";
import {UserConfirmResponseDialogComponent} from "common/dialog/user-confirm-response-dialog/user-confirm-response-dialog.component";
import * as codes from 'common/utilities/codes';
import {AssetTargeting} from "models/targeting-option.model";
import {parseTargetingOptionsToArray} from "common/components/targeting/targeting.helpers";

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss']
})
export class CampaignDetailsComponent extends HandleSubscription implements OnInit, OnDestroy {
  @ViewChild(ChartComponent) appChartRef: ChartComponent;

  campaign: Campaign;
  campaignStatusesEnum = campaignStatusesEnum;
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
    this.campaign = this.route.snapshot.data.campaign.campaign;
    this.getTargeting();

    const chartFilterSubscription = this.store.select('state', 'common', 'chartFilterSettings')
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.currentChartFilterSettings = chartFilterSettings;
      });
    this.subscriptions.push(chartFilterSubscription);

    this.getChartData(this.currentChartFilterSettings);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  deleteCampaign() {
    const dialogRef = this.dialog.open(UserConfirmResponseDialogComponent, {
      data: {
        message: 'Do you confirm deletion?',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.advertiserService.deleteCampaign(this.campaign.id)
            .subscribe(
              () => {
                this.router.navigate(
                  ['/advertiser'],
                );
              },

              (err) => {
                if (err.status !== codes.HTTP_INTERNAL_SERVER_ERROR) {
                  this.dialog.open(ErrorResponseDialogComponent, {
                    data: {
                      title: `Campaign cannot be deleted`,
                      message: `Given campaign (${this.campaign.id}) cannot be deleted at this moment. Please try again, later`,
                    }
                  });
                }
              }
            );
        }
      },
      () => {
      }
    );
  }

  getTargeting() {
    this.campaign.targeting = {
      requires: this.campaign.targeting.requires || [],
      excludes: this.campaign.targeting.excludes || [],
    };
    this.targetingOptions = this.route.snapshot.data.targetingOptions;
    this.targeting = parseTargetingOptionsToArray(this.campaign.targeting, this.targetingOptions);
  }

  getChartData(chartFilterSettings) {
    this.barChartData[0].data = [];
    const chartDataSubscription = this.chartService
      .getAssetChartData(
        chartFilterSettings.currentFrom,
        chartFilterSettings.currentTo,
        chartFilterSettings.currentFrequency,
        this.campaign.id,
        chartFilterSettings.currentSeries,
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

  onCampaignStatusChange(status) {
    const statusActive = status !== this.campaignStatusesEnum.ACTIVE;

    this.campaign.basicInformation.status =
      statusActive ? this.campaignStatusesEnum.ACTIVE : this.campaignStatusesEnum.INACTIVE;

    this.advertiserService
      .updateStatus(this.campaign.id, this.campaign.basicInformation.status)
      .subscribe(
        () => {
        },
        (err) => {
          if (err.status === codes.HTTP_NOT_FOUND) {
            this.dialog.open(ErrorResponseDialogComponent, {
              data: {
                title: `Campaign cannot be found`,
                message: `Given campaign (${this.campaign.id}) does not exist or does not belong to you`,
              }
            });
          }
        }
      );
  }

  classificationLabel() {
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
        .subscribe(data => {
          console.log(data);
        });
    } else {
      this.advertiserService
        .removeClassifyCampaign(this.campaign.id)
        .subscribe(data => {
          console.log(data);
        });
    }
  }

  isClassificationChecked(status) {
    return status !== this.classificationStatusesEnum.DISABLED;
  }
}
