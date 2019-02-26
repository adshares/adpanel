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

  constructor() {
  }
  
  private isImage() {
    return this.banner.type === adTypesEnum.IMAGE;
  }
}
