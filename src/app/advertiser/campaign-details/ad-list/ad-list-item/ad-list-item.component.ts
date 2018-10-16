import { Component, Input } from '@angular/core';

import { AdvertiserService } from 'advertiser/advertiser.service';
import { HandleSubscription } from 'common/handle-subscription';
import { adStatusesEnum } from 'models/enum/ad.enum';
import { Ad } from 'models/campaign.model';
import { adTypesEnum } from 'models/enum/ad.enum';

@Component({
  selector: 'app-ad-list-item',
  templateUrl: './ad-list-item.component.html',
  styleUrls: ['./ad-list-item.component.scss'],
})
export class AdListItemComponent extends HandleSubscription {
  @Input() ad: Ad;

  adStatusesEnum = adStatusesEnum;

  constructor(private advertiserService: AdvertiserService) {
    super();
  }

  adType() {
    return adTypesEnum[this.ad.type];
  };

  changeAdStatus(status) {
    const statusActive = status !== this.adStatusesEnum.ACTIVE;

    this.ad.status =
      statusActive ? this.adStatusesEnum.ACTIVE : this.adStatusesEnum.ARCHIVED;

    const saveAdSubscription = this.advertiserService.saveAd(this.ad).subscribe();
    this.subscriptions.push(saveAdSubscription);
  }
}
