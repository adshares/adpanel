import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Campaign } from '../../models/campaign.model';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss'],
})
export class CampaignDetailsComponent {
  campaign: Campaign;

  constructor(
    private route: ActivatedRoute,
  ) {
    this.campaign = this.route.snapshot.data.campaign;
  }
}
