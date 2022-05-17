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
import { ChartLabels } from 'models/chart/chart-labels.model';
import { AssetTargeting, TargetingOption } from 'models/targeting-option.model';
import { createInitialArray, enumToArray, sortArrayByKeys } from 'common/utilities/helpers';
import { siteStatusEnum } from 'models/enum/site.enum';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';
import { LoadSiteTotals, UpdateSiteStatus } from 'store/publisher/publisher.actions';
import { DecentralandConverter } from 'common/utilities/targeting-converter/decentraland-converter'

import { parseTargetingOptionsToArray } from 'common/components/targeting/targeting.helpers';
import { MatDialog } from '@angular/material';
import { UserConfirmResponseDialogComponent } from 'common/dialog/user-confirm-response-dialog/user-confirm-response-dialog.component';
import * as codes from 'common/utilities/codes';
import { ChartComponent } from 'common/components/chart/chart.component';
import { TableSortEvent } from 'models/table.model';
import { adUnitTypesEnum } from 'models/enum/ad.enum';
import { SiteCodeDialogComponent } from 'publisher/dialogs/site-code-dialog/site-code-dialog.component';
import { appSettings } from 'app-settings';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { RequestReport } from 'store/common/common.actions';
import { reportType } from 'models/enum/user.enum';
import {
  SiteCodeMetaverseDialogComponent
} from 'publisher/dialogs/site-code-metaverse-dialog/site-code-metaverse-dialog.component'
import { faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-site-details',
  templateUrl: './site-details.component.html',
  styleUrls: ['./site-details.component.scss'],
})
export class SiteDetailsComponent extends HandleSubscription implements OnInit {
  @ViewChild(ChartComponent) appChartRef: ChartComponent;
  dataLoaded: boolean = false;
  site: Site;
  siteStatusEnum = siteStatusEnum;
  siteStatusEnumArray = enumToArray(siteStatusEnum);
  language: SiteLanguage;

  filtering: AssetTargeting = {
    requires: [],
    excludes: [],
  };
  filteringOptions: TargetingOption[];
  currentSiteStatus: string;
  barChartValue: number;
  barChartDifference: number;
  barChartDifferenceInPercentage: number;
  barChartLabels: ChartLabels[] = [];
  barChartData: ChartData[] = createInitialArray([{data: []}], 1);
  currentChartFilterSettings: ChartFilterSettings;
  mediumLabel: string;
  displayAds: boolean;
  siteLinkUrl: string
  readonly faExternalLinkSquareAlt = faExternalLinkSquareAlt

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

  get canActivateSite(): boolean {
    return (this.currentSiteStatus === this.siteStatusEnum[this.siteStatusEnum.DRAFT].toLowerCase()) ||
      (this.currentSiteStatus === this.siteStatusEnum[this.siteStatusEnum.INACTIVE].toLowerCase());
  }

  get statusButtonLabel(): string {
    return this.canActivateSite ? 'Activate' : 'Deactivate'
  }

  ngOnInit(): void {
    this.site = this.route.snapshot.data.site;
    this.displayAds = this.site.medium !== 'metaverse';
    this.prepareMediumLabel(this.site);
    this.currentSiteStatus = siteStatusEnum[this.site.status].toLowerCase();
    this.filteringOptions = this.route.snapshot.data.filteringOptions;
    this.language = this.route.snapshot.data.languagesList.find(lang => lang.code === this.site.primaryLanguage);
    this.siteLinkUrl = this.site.medium === 'metaverse' && this.site.vendor === 'decentraland'
      ? new DecentralandConverter().convertToDecentralandSiteUrl(this.site.url)
      : this.site.url

    this.store.select('state', 'common', 'chartFilterSettings')
      .pipe(take(1))
      .subscribe((chartFilterSettings: ChartFilterSettings) => {
        this.getChartData(chartFilterSettings, this.site.id);
      });

    const chartFilterSubscription = this.store.select('state', 'common', 'chartFilterSettings')
      .subscribe((chartFilterSettings: ChartFilterSettings) => this.currentChartFilterSettings = chartFilterSettings);

    const sitesSubscription = this.store.select('state', 'publisher', 'sites')
      .subscribe((sites: Site[]) => {
        this.site = sites.find(el => el.id === this.site.id);
        this.getFiltering();
      });

    const dataLoadedSubscription = this.store.select('state', 'publisher', 'dataLoaded')
      .subscribe((dataLoaded: boolean) => this.dataLoaded = dataLoaded);

    const refreshSubscription = timer(appSettings.AUTOMATIC_REFRESH_INTERVAL, appSettings.AUTOMATIC_REFRESH_INTERVAL)
      .subscribe(() => {
        if (this.currentChartFilterSettings && this.site && this.site.id) {
          this.getChartData(this.currentChartFilterSettings, this.site.id, false);
        }
      });

    this.subscriptions.push(chartFilterSubscription, sitesSubscription, dataLoadedSubscription, refreshSubscription);
  }

  private prepareMediumLabel (site: Site): void {
    const medium = this.route.snapshot.data.media[site.medium]
    if (medium) {
      if (site.vendor === null) {
        this.mediumLabel = `${medium} ads`
        return
      }
      this.publisherService.getMediumVendors(site.medium).subscribe(vendors => {
        const vendor = vendors[site.vendor]
        this.mediumLabel = vendor ? `${medium} ads in ${vendor}` : `${medium} ads`
      })
    }
  }

  sortTable(event: TableSortEvent): void {
    this.site.adUnits = sortArrayByKeys(this.site.adUnits, event.keys, event.sortDesc);
  }

  deleteSite(): void {
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
      }
    );
  }

  getFiltering(): void {
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

  getChartData(chartFilterSettings, siteId, reload: boolean = true): void {
    if (reload) {
      this.barChartData[0].data = [];
    }

    this.chartService
      .getAssetChartData(
        chartFilterSettings.currentFrom,
        chartFilterSettings.currentTo,
        chartFilterSettings.currentFrequency,
        chartFilterSettings.currentSeries.value,
        'sites',
        siteId
      )
      .pipe(take(1))
      .subscribe(data => {
        this.barChartData[0].data = data.values;
        this.barChartData[0].currentSeries = chartFilterSettings.currentSeries.label;
        this.barChartLabels = data.timestamps.map(item => moment(item).format());
        this.barChartValue = data.total;
        this.barChartDifference = data.difference;
        this.barChartDifferenceInPercentage = data.differenceInPercentage;
      });

    this.store.dispatch(new LoadSiteTotals({
      from: chartFilterSettings.currentFrom,
      to: chartFilterSettings.currentTo,
      id: siteId
    }));
  }

  navigateToEditSite(path: string): void {
    this.router.navigate(['/publisher', 'edit-site', this.site.id, path]);
  }

  navigateToClassification(): void {
    this.router.navigate(
      ['/publisher', 'site', this.site.id, 'classifier'],
    );
  }

  onSiteStatusChange(): void {
    if (this.canActivateSite) {
      this.currentSiteStatus = 'active';
    } else {
      this.currentSiteStatus = 'inactive';
    }
    this.site.status = this.siteStatusEnumArray.findIndex(el => el === this.currentSiteStatus);
    this.store.dispatch(new UpdateSiteStatus(this.site));
  }

  downloadReport(): void {
    this.store.dispatch(
      new RequestReport(
        {
          type: reportType.SITES,
          dateStart: this.currentChartFilterSettings.currentFrom,
          dateEnd: this.currentChartFilterSettings.currentTo,
          id: this.site.id,
        }
      )
    );
  }

  private hasSitePops(): boolean {
    return -1 !== this.site.adUnits.findIndex(adUnit => adUnitTypesEnum.POP === adUnit.type);
  }

  openGetCodeDialog(): void {
    if (!this.displayAds) {
      this.dialog.open(SiteCodeMetaverseDialogComponent, {
        data : {
          vendor: this.site.vendor,
        },
      });
      return
    }

    this.dialog.open(SiteCodeDialogComponent, {
      data : {
        siteId : this.site.id,
        hasSitePops: this.hasSitePops(),
      },
    });
  }
}
