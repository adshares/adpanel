import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-campaign-navigation',
  templateUrl: './edit-campaign-navigation.component.html',
  styleUrls: ['./edit-campaign-navigation.component.scss'],
})
export class EditCampaignNavigationComponent implements OnInit {
  steps = [
    { id: 1, name: 'Basic Information', link: 'basic-information' },
    { id: 2, name: 'Additional Information', link: 'additional-information' },
    { id: 3, name: 'Create Ads', link: 'edit-campaign-create-ads' },
    { id: 4, name: 'Summary', link: 'summary' }
  ];

  currentStep: number;
  private sub: any;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      this.currentStep = params.step;
    });
  }
}
