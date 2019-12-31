import {Component, Input, OnInit} from '@angular/core';
import {BannerClassification} from 'models/classifier.model';
import {Ad} from 'models/campaign.model';
import {adTypesEnum} from 'models/enum/ad.enum';
import {HTTP_OK} from 'common/utilities/codes';
import {HttpClient} from "@angular/common/http";

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

  constructor(private http: HttpClient) {
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
    fetch(url)
      .then(res => {
        this.isLoading = false;
        this.showIframe = res.status === HTTP_OK;
      })
      .catch(() => {
        this.showIframe = false;
        this.isLoading = false;
      })
  }
}
