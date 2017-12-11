import { Component, Input } from '@angular/core';

import { Campaign } from '../../../models/campaign.model';

@Component({
  selector: 'app-campaign-list-item',
  templateUrl: './campaign-list-item.component.html',
  styleUrls: ['./campaign-list-item.component.scss'],
})
export class CampaignListItemComponent {
  @Input() campaign: Campaign;
}
