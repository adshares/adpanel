import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { PublisherService } from 'publisher/publisher.service';
import {
  BannerClassification,
  BannerClassificationFilters,
  BannerClassificationResponse,
} from 'models/classifier.model';
import { HTTP_INTERNAL_SERVER_ERROR } from 'common/utilities/codes';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { Site } from 'models/site.model';

@Component({
  selector: 'app-classifier',
  templateUrl: './classifier.component.html',
  styleUrls: ['./classifier.component.scss'],
})
export class ClassifierComponent extends HandleSubscriptionComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;

  readonly PAGE_SIZE: number = 20;
  siteId?: number;
  siteName?: string;
  isGlobal: boolean = true;
  isSingleBanner: boolean;
  isLoading: boolean = true;
  bannerClassifications: BannerClassification[] = [];
  totalCount: number = 0;
  refreshIcon = faSyncAlt;
  adSizesOptions: string[];
  classifierLocalBanners: number;
  filtering: BannerClassificationFilters = {
    status: {
      unclassified: 1,
    },
    sizes: [],
  };
  bannerId: string;

  constructor(
    private route: ActivatedRoute,
    private publisherService: PublisherService,
    private router: Router,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    const site: Site = this.route.snapshot.data.site;
    const classifierOption = this.route.snapshot.data.siteOptions.classifierLocalBanners;
    this.siteId = site ? site.id : null;
    this.siteName = site ? site.name : null;
    this.isGlobal = site === undefined;
    this.adSizesOptions = this.route.snapshot.data.sizes.sizes;
    this.bannerId = this.route.snapshot.params['bannerId'];
    this.isSingleBanner = this.bannerId !== undefined;
    this.classifierLocalBanners = classifierOption === 'all-by-default' ? 0 : 1;
    this.filtering.classifierLocalBanners = this.classifierLocalBanners;
    this.filtering.sizes = this.route.snapshot.data.sizes.sizes;
    if (this.isSingleBanner) {
      this.filtering = {
        ...this.filtering,
        bannerId: this.bannerId,
      };
    }

    this.getBannerClassification();
  }

  getBannerClassification(offset?: number) {
    this.isLoading = true;
    const bannersForClassificationSubscription = this.publisherService
      .getBannerClassification(this.siteId, this.PAGE_SIZE, this.filtering, offset)
      .subscribe(
        (bannerClassificationResponse: BannerClassificationResponse) => {
          this.bannerClassifications = bannerClassificationResponse.items;
          this.totalCount = bannerClassificationResponse.itemsCountAll;
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          if (error.status !== HTTP_INTERNAL_SERVER_ERROR) {
            this.dialog.open(ErrorResponseDialogComponent, {
              data: {
                title: `Error ${error.status}`,
                message: `Banner list is not available at this moment. Please, try again later.`,
              },
            });
          }
          this.bannerClassifications = [];
          this.totalCount = 0;
          this.isLoading = false;
        }
      );
    this.subscriptions.push(bannersForClassificationSubscription);
  }

  onStepBack(): void {
    if (this.isGlobal) {
      this.router.navigate(['/publisher', 'dashboard']);
    } else {
      this.router.navigate(['/publisher', 'site', this.siteId]);
    }
  }

  goToGeneralClassifier(): void {
    this.router.navigate(['/publisher', 'classifier']);
  }

  handlePaginationEvent(event: any): void {
    const offset = event.pageIndex * this.PAGE_SIZE;
    this.getBannerClassification(offset);
  }

  refresh(): void {
    this.paginator.firstPage();
    this.getBannerClassification();
  }

  updateBannersList(filtering: BannerClassificationFilters): void {
    this.filtering = { ...this.filtering, ...filtering };
    this.getBannerClassification();
  }
}
