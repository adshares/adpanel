import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

import { ChartService } from 'common/chart.service';
import { PublisherService } from 'publisher/publisher.service';
import { HandleSubscription } from 'common/handle-subscription';
import { AppState } from 'models/app-state.model';
import { AdUnit, Site, SiteLanguage } from 'models/site.model';
import { ChartFilterSettings } from 'models/chart/chart-filter-settings.model';
import { ChartData } from 'models/chart/chart-data.model';
import { AssetTargeting } from 'models/targeting-option.model';
import { createInitialArray, downloadCSVFile, enumToArray, sortArrayByKeys } from 'common/utilities/helpers';
import { siteStatusEnum } from 'models/enum/site.enum';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';
import * as PublisherActions from 'store/publisher/publisher.actions';

import { parseTargetingOptionsToArray } from 'common/components/targeting/targeting.helpers';
import { MatDialog } from '@angular/material';
import { UserConfirmResponseDialogComponent } from 'common/dialog/user-confirm-response-dialog/user-confirm-response-dialog.component';
import * as codes from 'common/utilities/codes';
import { ChartComponent } from 'common/components/chart/chart.component';
import { TableSortEvent } from 'models/table.model';
import { adUnitTypesEnum } from "models/enum/ad.enum";

@Component({
  selector: 'app-site-details',
  templateUrl: './site-details.component.html',
  styleUrls: ['./site-details.component.scss'],
})
export class SiteDetailsComponent extends HandleSubscription implements OnInit {
  @ViewChild(ChartComponent) appChartRef: ChartComponent;
  site: Site;
  siteStatusEnum = siteStatusEnum;
  siteStatusEnumArray = enumToArray(siteStatusEnum);
  language: SiteLanguage;

  filtering: AssetTargeting = {
    requires: [],
    excludes: [],
  };
  filteringOptions: AssetTargeting;
  currentSiteStatus: string;
  barChartValue: number;
  barChartDifference: number;
  barChartDifferenceInPercentage: number;
  barChartLabels: string[] = [];
  barChartData: ChartData[] = createInitialArray([{data: []}], 1);

  currentChartFilterSettings: ChartFilterSettings;

  constructor(
    private route: ActivatedRoute,
    private publisherService: PublisherService,
    private router: Router,
    private store: Store<AppState>,
    private chartService: ChartService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    this.site = this.route.snapshot.data.site;
    this.currentSiteStatus = siteStatusEnum[this.site.status].toLowerCase();
    this.filteringOptions = this.route.snapshot.data.filteringOptions;
    this.language = this.route.snapshot.data.languagesList.find(lang => lang.code === this.site.primaryLanguage);

    this.store.select('state', 'common', 'chartFilterSettings')
      .take(1)
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.getChartData(chartFilterSettings, this.site.id);
      });

    const chartFilterSubscription = this.store.select('state', 'common', 'chartFilterSettings')
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.currentChartFilterSettings = chartFilterSettings;
      });

    const sitesSubscription = this.store.select('state', 'publisher', 'sites')
      .subscribe((sites: Site[]) => {
        this.site = sites.find(el => el.id === this.site.id);
        this.getFiltering();
      });

    this.subscriptions.push(chartFilterSubscription, sitesSubscription);
  }

  get popAdUnits(): AdUnit[] {
    return this.site.adUnits.filter(adUnit => {
      return adUnit.type === adUnitTypesEnum.POP;
    });
  }

  get displayAdUnits(): AdUnit[] {
    return this.site.adUnits.filter(adUnit => {
      return adUnit.type === adUnitTypesEnum.DISPLAY;
    });
  }

  sortTable(event: TableSortEvent) {
    this.site.adUnits = sortArrayByKeys(this.site.adUnits, event.keys, event.sortDesc);
  }

  deleteSite() {
    const dialogRef = this.dialog.open(UserConfirmResponseDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this site?',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.publisherService.deleteSite(this.site.id)
            .subscribe(
              () => {
                this.router.navigate(['/publisher', 'dashboard']);
              },
              (err) => {
                if (err.status !== codes.HTTP_INTERNAL_SERVER_ERROR) {
                  this.dialog.open(ErrorResponseDialogComponent, {
                    data: {
                      title: `Site cannot be deleted`,
                      message: `Given site (${this.site.id}) cannot be deleted at this moment. Please try again, later`,
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

  getFiltering() {
    this.site.filtering = {
      requires: this.site.filtering.requires || [],
      excludes: this.site.filtering.excludes || [],
    };

    if (this.filtering.requires.length || this.filtering.excludes.length || !this.site) return;
    if (Array.isArray(this.site.filtering.requires) && Array.isArray(this.site.filtering.excludes)) {
      this.filtering = this.site.filtering as AssetTargeting;
    } else {
      this.filtering = parseTargetingOptionsToArray(this.site.filtering, this.filteringOptions);
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
        'sites',
        id
      )
      .subscribe(data => {
        this.barChartData[0].data = data.values;
        this.barChartData[0].currentSeries = chartFilterSettings.currentSeries.label;
        this.barChartLabels = data.timestamps.map((item) => moment(item).format());
        this.barChartValue = data.total;
        this.barChartDifference = data.difference;
        this.barChartDifferenceInPercentage = data.differenceInPercentage;
      });

    this.subscriptions.push(chartDataSubscription);
  }

  navigateToEditSite(path: string, step: number): void {
    this.router.navigate(
      ['/publisher', 'edit-site', this.site.id, path],
      {queryParams: {step, summary: true}}
    );
  }

  onSiteStatusChange() {
    if (this.canActivateSite) {
      this.currentSiteStatus = 'active';
    } else {
      this.currentSiteStatus = 'inactive';
    }
    this.site.status = this.siteStatusEnumArray.findIndex(el => el === this.currentSiteStatus);
    this.store.dispatch(new PublisherActions.UpdateSiteStatus(this.site));
  }

  get canActivateSite(): boolean {
    return (this.currentSiteStatus === this.siteStatusEnum[this.siteStatusEnum.DRAFT].toLowerCase()) ||
      (this.currentSiteStatus === this.siteStatusEnum[this.siteStatusEnum.INACTIVE].toLowerCase());
  }

  get statusButtonLabel(): string {
    return this.canActivateSite ? 'Activate' : 'Deactivate'
  }

  downloadReport() {
    const settings = this.currentChartFilterSettings;
    this.publisherService.report(settings.currentFrom, settings.currentTo, this.site.id)
      .subscribe((data) => {
        downloadCSVFile(data, settings.currentFrom, settings.currentTo);
      });
  }
}
