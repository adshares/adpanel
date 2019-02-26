import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material';

import { PublisherService } from 'publisher/publisher.service';
import { Site } from 'models/site.model';
import { BannerClassification } from 'models/classifier.model';
import { TableColumnMetaData } from 'models/table.model';
import * as codes from 'common/utilities/codes';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';


@Component({
  selector: 'app-classifier',
  templateUrl: './classifier.component.html',
  styleUrls: ['./classifier.component.scss']
})
export class ClassifierComponent implements OnInit {
  siteId?: number;
  isGlobal: boolean = true;
  isLoading: boolean = true;
  bannerClassifications: BannerClassification[] = [];

  constructor(
    private route: ActivatedRoute,
    private publisherService: PublisherService,
    private router: Router,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    const site: Site = this.route.snapshot.data.site;
    this.siteId = site ? site.id : null;
    this.isGlobal = site === undefined;

    this.getBannerClassification();
  }

  getBannerClassification(limit?: number, offset?: number) {
    this.isLoading = true;

    this.publisherService.getBannerClassification(this.siteId, limit, offset)
      .subscribe(
        (bannerList: BannerClassification[]) => {
          this.bannerClassifications = bannerList;
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          if (error.status !== codes.HTTP_INTERNAL_SERVER_ERROR) {
            this.dialog.open(ErrorResponseDialogComponent, {
              data: {
                title: `Error ${error.status}`,
                message: `Banner list is not available at this moment. Please, try again later.`,
              }
            });
          }
          this.bannerClassifications = [];
          this.isLoading = false;
        }
      );
  }

  sortTable(columnMetaData: TableColumnMetaData) {
  }

  onStepBack() {
    this.isGlobal ? this.router.navigate(['/publisher', 'dashboard']) :
      this.router.navigate(['/publisher', 'site', this.siteId]);
  }
}
