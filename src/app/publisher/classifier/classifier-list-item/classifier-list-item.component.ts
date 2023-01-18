import { Component, Input, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

import { PublisherService } from 'publisher/publisher.service';
import { BannerClassification } from 'models/classifier.model';
import { HTTP_INTERNAL_SERVER_ERROR } from 'common/utilities/codes';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';

@Component({
  selector: 'app-classifier-list-item',
  templateUrl: './classifier-list-item.component.html',
  styleUrls: ['./classifier-list-item.component.scss'],
})
export class ClassifierListItemComponent implements OnInit {
  @Input() bannerClassification: BannerClassification;
  @Input() siteId: number;
  readonly APPROVED: boolean = true;
  readonly REJECTED: boolean = false;

  isGlobal: boolean;

  constructor(private publisherService: PublisherService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.isGlobal = this.siteId === null;
  }

  setClassificationStatus(isApproved: boolean | null): void {
    this.bannerClassification.classifiedGlobal = isApproved;
    if (this.isGlobal) {
      this.bannerClassification.classifiedGlobal = isApproved;
    } else {
      this.bannerClassification.classifiedSite = isApproved;
    }
  }

  get classified(): boolean | null {
    return this.isGlobal ? this.bannerClassification.classifiedGlobal : this.bannerClassification.classifiedSite;
  }

  classifyBanner(isApproved: boolean): void {
    const previousClassified = this.classified;
    this.setClassificationStatus(isApproved);

    this.publisherService
      .setBannerClassification(this.bannerClassification.bannerId, isApproved, this.siteId)
      .subscribe(
        () => {
          /* This is intentional */
        },
        (error: HttpErrorResponse) => {
          this.setClassificationStatus(previousClassified);
          if (error.status !== HTTP_INTERNAL_SERVER_ERROR) {
            this.dialog.open(ErrorResponseDialogComponent, {
              data: {
                title: `Error ${error.status}`,
                message: `Change is not available at this moment. Please, try again later.`,
              },
            });
          }
        }
      );
  }
}
