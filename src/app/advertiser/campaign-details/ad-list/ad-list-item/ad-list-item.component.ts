import { Component, Input } from '@angular/core';

import { AdvertiserService } from 'advertiser/advertiser.service';
import { HandleSubscription } from 'common/handle-subscription';
import { adStatusesEnum } from 'models/enum/ad.enum';
import { enumToObjectArray, selectCompare } from 'common/utilities/helpers';

@Component({
  selector: 'app-ad-list-item',
  templateUrl: './ad-list-item.component.html',
  styleUrls: ['./ad-list-item.component.scss'],
})
export class AdListItemComponent extends HandleSubscription {
  @Input() ad;

  adStatuses = enumToObjectArray(adStatusesEnum);
  selectCompare = selectCompare;

  constructor(private advertiserService: AdvertiserService) {
    super();
  }

  changeAdStatus() {
    const saveAdSubscription = this.advertiserService.saveAd(this.ad).subscribe();
    this.subscriptions.push(saveAdSubscription);
  }
}
