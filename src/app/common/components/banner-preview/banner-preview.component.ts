import { Component, Input, OnInit } from '@angular/core';
import { BannerClassification } from 'models/classifier.model';
import { Ad } from 'models/campaign.model';
import { adTypesEnum } from 'models/enum/ad.enum';

@Component({
  selector: 'app-banner-preview',
  templateUrl: './banner-preview.component.html',
  styleUrls: ['./banner-preview.component.scss'],
})
export class BannerPreviewComponent implements OnInit {
  @Input() banner: BannerClassification | Ad;
  readonly IFRAME_TITLE: string = 'Banner Preview';

  isBannerInputTypeAd: boolean;
  bannerUrl: string;
  bannerHtml: string;

  constructor() {
  }

  ngOnInit(): void {
    if ((<BannerClassification>this.banner).url) {
      this.isBannerInputTypeAd = false;
      this.bannerUrl = (<BannerClassification>this.banner).url;
    } else {
      this.isBannerInputTypeAd = true;
      this.bannerUrl = (<Ad>this.banner).imageUrl;
      this.bannerHtml = (<Ad>this.banner).html;
    }
  }

  get isImage() {
    return this.banner.type === adTypesEnum.IMAGE;
  }
}
