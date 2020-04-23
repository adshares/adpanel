import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BannerClassification } from 'models/classifier.model';
import { Ad, AdPreview } from 'models/campaign.model';
import { adTypesEnum } from 'models/enum/ad.enum';
import { AdPreviewDialogComponent } from 'common/dialog/ad-preview-dialog/ad-preview-dialog.component';
import { HTTP_OK } from 'common/utilities/codes';

@Component({
  selector: 'app-banner-preview',
  templateUrl: './banner-preview.component.html',
  styleUrls: ['./banner-preview.component.scss'],
})

export class BannerPreviewComponent implements OnInit {
  @Input() banner: BannerClassification | Ad;
  @Input() landingUrl: string;
  @Input() maxWidth: number;
  maxHeight: number = 100;

  bannerChosenSize = {
    width: '',
    height: '',
  };

  isBannerInputTypeAd: boolean;
  url: string;
  showIframe: boolean = false;
  isLoading: boolean = true;
  scale: number = 1;

  constructor(
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    if ((<BannerClassification>this.banner).size) {
      this.isBannerInputTypeAd = false;
      this.url = (<BannerClassification>this.banner).url;

      const size = (<BannerClassification>this.banner).size;
      if (size.includes('x', 1)) {
        const bannerSizeArray = size.split('x');
        this.bannerChosenSize = {
          width: bannerSizeArray[0] + 'px',
          height: bannerSizeArray[1] + 'px',
        };
        this.scale = this.computeScale(parseInt(bannerSizeArray[0]), parseInt(bannerSizeArray[1]));
      } else {
        this.bannerChosenSize = {
          width: '100%',
          height: '100%',
        };
      }
    } else if (this.isDirectLink) {
      this.isBannerInputTypeAd = true;
      this.url = (<Ad>this.banner).creativeContents;
    } else {
      this.isBannerInputTypeAd = true;
      this.url = (<Ad>this.banner).url;
      const bannerSizeArray = (<Ad>this.banner).creativeSize.split('x');
      this.bannerChosenSize = {
        width: bannerSizeArray[0] + 'px',
        height: bannerSizeArray[1] + 'px',
      };
      this.scale = this.computeScale(parseInt(bannerSizeArray[0]), parseInt(bannerSizeArray[1]));
    }

    if (this.isBannerInputTypeAd && this.isHtml) {
      this.canLoadIframeContent(this.url)
    } else {
      this.isLoading = false;
      this.showIframe = true;
    }
  }

  get isImage() {
    return this.banner.type === adTypesEnum.IMAGE;
  }

  get isHtml() {
    return this.banner.type === adTypesEnum.HTML;
  }

  get isDirectLink() {
    return this.banner.type === adTypesEnum.DIRECT;
  }

  canLoadIframeContent(url: string) {
    fetch(url, {method: 'HEAD'})
      .then(res => {
        this.isLoading = false;
        this.showIframe = res.status === HTTP_OK;
      })
      .catch(() => {
        this.showIframe = false;
        this.isLoading = false;
      })
  }

  private computeScale(width: number, height: number): number {
    if (width <= this.maxWidth && height <= this.maxHeight) {
      return 1;
    }

    const containerAspect = this.maxWidth / this.maxHeight;
    const aspect = width / height;

    if (containerAspect < aspect) {
      return this.maxWidth / width;
    }

    return this.maxHeight / height;
  }

  zoomIn(): void {
    if (!this.isImage && (!this.showIframe || !this.isHtml)) {
      return;
    }

    const size = (<BannerClassification>this.banner).size ? (<BannerClassification>this.banner).size : (<Ad>this.banner).creativeSize;
    const adPreview: AdPreview = {
      isHtml: this.isHtml,
      size: size,
      url: this.banner.url,
      landingUrl: this.landingUrl,
    };

    this.dialog.open(AdPreviewDialogComponent, {data: adPreview});
  }
}
