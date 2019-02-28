import { Component, Input } from '@angular/core';
import { BannerClassification } from 'models/classifier.model';
import { Ad } from 'models/campaign.model';
import { adTypesEnum } from 'models/enum/ad.enum';

@Component({
  selector: 'app-banner-preview',
  templateUrl: './banner-preview.component.html',
  styleUrls: ['./banner-preview.component.scss'],
})
export class BannerPreviewComponent {
  @Input() banner: BannerClassification | Ad;
  readonly IFRAME_TITLE: string = 'Banner Preview';
  readonly HTML_SRCDOC_PREFIX: string = '<style>body{margin:0;padding:0;}</style>';

  constructor() {
  }
  
  private isImage() {
    return this.banner.type === adTypesEnum.IMAGE;
  }
}
