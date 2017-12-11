import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-campaign-additional-targeting',
  templateUrl: './edit-campaign-additional-targeting.component.html',
  styleUrls: ['./edit-campaign-additional-targeting.component.scss'],
})
export class EditCampaignAdditionalTargetingComponent {
  goesToSummary: boolean;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => this.goesToSummary = params.summary);
  };
}
