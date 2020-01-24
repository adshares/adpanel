import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatPaginator } from '@angular/material';
import { PublisherService } from 'publisher/publisher.service';
import {
  BannerClassification,
  BannerClassificationFilters,
  BannerClassificationResponse
} from 'models/classifier.model';
import { TableSortEvent } from 'models/table.model';
import { HTTP_INTERNAL_SERVER_ERROR } from 'common/utilities/codes';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { HandleSubscription } from "common/handle-subscription";

@Component({
  selector: 'app-classifier',
  templateUrl: './classifier.component.html',
  styleUrls: ['./classifier.component.scss']
})
export class ClassifierComponent extends HandleSubscription implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;

  readonly PAGE_SIZE: number = 20;
  isSingleBanner: boolean;
  isLoading: boolean = true;
  bannerClassifications: BannerClassification[] = [];
  totalCount: number = 0;
  refreshIcon = faSyncAlt;
  adSizesOptions: string[];
  filtering: BannerClassificationFilters = {
    status: {
      unclassified: 1
    },
    sizes: [],
  };
  bannerId: string;

  constructor(
    private route: ActivatedRoute,
    private publisherService: PublisherService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    super()
  }

  ngOnInit(): void {
    this.adSizesOptions = this.route.snapshot.data.sizes.sizes;

    this.bannerId = this.route.snapshot.params['bannerId'];
    this.isSingleBanner = this.bannerId !== undefined;
    if (this.isSingleBanner) {
      this.filtering = {
        bannerId: this.bannerId,
      }
    }

    this.getBannerClassification();
  }

  getBannerClassification(offset?: number) {
    this.isLoading = true;
    const bannersForClassificationSubscription = this.publisherService
      .getBannerClassification(this.PAGE_SIZE, this.filtering, this.adSizesOptions, offset)
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
              }
            });
          }
          this.bannerClassifications = [];
          this.totalCount = 0;
          this.isLoading = false;
        }
      );
    this.subscriptions.push(bannersForClassificationSubscription);
  }

  sortTable(event: TableSortEvent) {
  }

  onStepBack() {
    this.router.navigate(['/publisher', 'dashboard']);
  }

  goToGeneralClassifier() {
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
    this.filtering = filtering;
    this.getBannerClassification()
  }
}
