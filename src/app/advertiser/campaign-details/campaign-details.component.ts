import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

import { Campaign } from 'models/campaign.model';
import { AppState } from 'models/app-state.model';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { ChartComponent } from 'common/components/chart/chart.component';
import { ChartService } from 'common/chart.service';
import { ChartFilterSettings } from 'models/chart/chart-filter-settings.model';
import { ChartData } from 'models/chart/chart-data.model';
import { campaignStatusesEnum } from 'models/enum/campaign.enum';
import { classificationStatusesEnum } from 'models/enum/classification.enum';
import { createInitialArray } from 'common/utilities/helpers';
import { HandleSubscription } from 'common/handle-subscription';
import * as advertiserActions from 'store/advertiser/advertiser.actions';
import {MatDialog} from "@angular/material";
import {ErrorResponseDialogComponent} from "common/dialog/error-response-dialog/error-response-dialog.component";

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss']
})
export class CampaignDetailsComponent extends HandleSubscription implements OnInit {
  @ViewChild(ChartComponent) appChartRef: ChartComponent;

  campaign: Campaign;
  campaignStatusesEnum = campaignStatusesEnum;
  classificationStatusesEnum = classificationStatusesEnum;

  barChartValue: number;
  barChartDifference: number;
  barChartDifferenceInPercentage: number;
  barChartLabels: string[] = [];
  barChartData: ChartData[] = createInitialArray([{ data: [] }], 1);

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

    const chartFilterSubscription = this.store.select('state', 'common', 'chartFilterSettings')
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.currentChartFilterSettings = chartFilterSettings;
      });
    this.subscriptions.push(chartFilterSubscription);

    this.getChartData(this.currentChartFilterSettings);
  }

  getChartData(chartFilterSettings) {
    this.barChartData[0].data = [];

    const chartDataSubscription = this.chartService
      .getAssetChartData(
        chartFilterSettings.currentFrom,
        chartFilterSettings.currentTo,
        chartFilterSettings.currentFrequency,
        chartFilterSettings.currentAssetId,
        chartFilterSettings.currentSeries
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

  navigateToEditCampaign() {
    this.store.dispatch(new advertiserActions.SetLastEditedCampaign(this.campaign));
    this.router.navigate(
      ['/advertiser', 'create-campaign', 'summary'],
      { queryParams: { step: 4} }
    );
  }

  navigateToCreateAd() {
    this.store.dispatch(new advertiserActions.SetLastEditedCampaign(this.campaign));
    this.router.navigate(
      ['/advertiser', 'create-campaign', 'create-ad'],
      { queryParams: { step: 3, summary: true} }
    );
  }

  onCampaignStatusChange(status) {
    const statusActive = status !== this.campaignStatusesEnum.ACTIVE;

    this.campaign.basicInformation.status =
      statusActive ? this.campaignStatusesEnum.ACTIVE : this.campaignStatusesEnum.INACTIVE;

    this.advertiserService
      .updateStatus(this.campaign.id, this.campaign.basicInformation.status)
      .subscribe(
        (err) => {
          if (err.status === 404) {
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
    if(status === 0) {
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
    if (status === this.classificationStatusesEnum.DISABLED) {
      return false;
    }

    return true;
  }
}
