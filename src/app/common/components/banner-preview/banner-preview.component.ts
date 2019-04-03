import { Component, Input, OnInit } from '@angular/core';
import { BannerClassification } from 'models/classifier.model';
import { Ad } from 'models/campaign.model';
import { adTypesEnum, adSizesEnum } from 'models/enum/ad.enum';
import { HTTP_OK } from "common/utilities/codes";

@Component({
  selector: 'app-banner-preview',
  templateUrl: './banner-preview.component.html',
  styleUrls: ['./banner-preview.component.scss'],
})

export class BannerPreviewComponent implements OnInit {
  @Input() banner: BannerClassification | Ad;
  bannerChosenSize = {
    width: '',
    height: '',
  };
  readonly IFRAME_TITLE: string = 'Banner Preview';

  isBannerInputTypeAd: boolean;
  url: string;
  showIframe: boolean = false;
  isLoading: boolean = true;

  constructor() {
  }

  ngOnInit(): void {
    if ((<BannerClassification>this.banner).url) {
      this.isBannerInputTypeAd = false;
      this.url = (<BannerClassification>this.banner).url;
      this.bannerChosenSize = {
        width: `${(<BannerClassification>this.banner).width}`,
        height: `${(<BannerClassification>this.banner).height}`
      };
    } else {
      this.isBannerInputTypeAd = true;
      this.url = (<Ad>this.banner).url;
      const bannerSizeArray = adSizesEnum[(<Ad>this.banner).size].split('x');
      this.bannerChosenSize = {
        width: bannerSizeArray[0],
        height: bannerSizeArray[1]
      };
    }

    if (this.isBannerInputTypeAd && !this.isImage) {
      this.canLoadIframeContent(this.url)
    } else {
      this.isLoading = false;
      this.showIframe = true;
    }
  }

  get isImage() {
    return this.banner.type === adTypesEnum.IMAGE;
  }

  canLoadIframeContent(url: string) {
    fetch(url)
      .then(res => {
        this.isLoading = false;
        if (res.status === HTTP_OK) {
          this.showIframe = true;
        } else {
          this.showIframe = false;
        }
      })
      .catch(() => {
        this.showIframe = false;
        this.isLoading = false;
      })
  }
}
