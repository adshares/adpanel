import {Component, Input, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';

import {PublisherService} from 'publisher/publisher.service';
import {BannerClassification} from 'models/classifier.model';
import * as codes from 'common/utilities/codes';

@Component({
  selector: 'app-classifier-list-item',
  templateUrl: './classifier-list-item.component.html',
  styleUrls: ['./classifier-list-item.component.scss'],
})
export class ClassifierListItemComponent implements OnInit {
  @Input() bannerClassification: BannerClassification;
  @Input() siteId: number;
  isGlobal: boolean;

  constructor(private publisherService: PublisherService) {
  }

  ngOnInit(): void {
    this.isGlobal = this.siteId === null;
  }

  setClassified(isApproved: boolean | null): void {
    if (this.isGlobal) {
      this.bannerClassification.classifiedGlobal = isApproved;
    } else {
      this.bannerClassification.classifiedSite = isApproved;
    }
  }

  getClassified(): boolean | null {
    return this.isGlobal ? this.bannerClassification.classifiedGlobal : this.bannerClassification.classifiedSite;
  }

  setBannerClassification(isApproved: boolean): void {
    const previousClassified = this.getClassified();
    this.setClassified(isApproved);

    this.publisherService.setBannerClassification(this.bannerClassification, this.siteId).subscribe(
      () => {
      },
      (error: HttpErrorResponse) => {
        this.setClassified(previousClassified);
        if (error.status !== codes.HTTP_INTERNAL_SERVER_ERROR) {
          // TODO handle error
          console.error('ClassifierListItemComponent', error);
        }
      }
    );
  }
}
