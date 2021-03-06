import { Component, Input, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material';

import { PublisherService } from 'publisher/publisher.service';
import { BannerClassification } from 'models/classifier.model';
import { HTTP_INTERNAL_SERVER_ERROR } from 'common/utilities/codes';
import { adTypesEnum } from 'models/enum/ad.enum';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';

@Component({
  selector: 'app-classifier-list-item',
  templateUrl: './classifier-list-item.component.html',
  styleUrls: ['./classifier-list-item.component.scss'],
})
export class ClassifierListItemComponent implements OnInit {
  @Input() bannerClassification: BannerClassification;
  readonly APPROVED: boolean = true;
  readonly REJECTED: boolean = false;

  adTypesEnum = adTypesEnum;

  constructor(private publisherService: PublisherService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.bannerClassification = {
      ...this.bannerClassification,
      type: this.adTypesEnum[this.bannerClassification.type.toUpperCase()],
    }
  }

  setClassificationStatus(isApproved: boolean | null): void {
    this.bannerClassification.classifiedGlobal = isApproved;
  }

  get classified(): boolean | null {
    return this.bannerClassification.classifiedGlobal;
  }

  classifyBanner(isApproved: boolean): void {
    const previousClassified = this.classified;
    this.setClassificationStatus(isApproved);

    this.publisherService.setBannerClassification(this.bannerClassification.bannerId, isApproved).subscribe(
      () => {
      },
      (error: HttpErrorResponse) => {
        this.setClassificationStatus(previousClassified);
        if (error.status !== HTTP_INTERNAL_SERVER_ERROR) {
          this.dialog.open(ErrorResponseDialogComponent, {
            data: {
              title: `Error ${error.status}`,
              message: `Change is not available at this moment. Please, try again later.`,
            }
          });
        }
      }
    );
  }
}
