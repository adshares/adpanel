import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';

@Component({
  selector: 'app-edit-asset-navigation',
  templateUrl: './edit-campaign-navigation.component.html',
  styleUrls: ['./edit-campaign-navigation.component.scss'],
})
export class EditCampaignNavigationComponent extends HandleSubscriptionComponent implements OnInit {
  steps = [
    { id: 1, name: 'Basic information' },
    { id: 2, name: 'Targeting' },
    { id: 3, name: 'Upload ads' },
    { id: 4, name: 'Summary' },
  ];

  currentStep: number;

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    const subscription = this.route.url.subscribe(urlSegments => this.updateStepByUrl(urlSegments));
    this.subscriptions.push(subscription);
  }

  private updateStepByUrl(urlSegments: UrlSegment[]): void {
    if (urlSegments && urlSegments[0]) {
      switch (urlSegments[0].path) {
        case 'basic-information':
          this.currentStep = 1;
          break;
        case 'additional-targeting':
          this.currentStep = 2;
          break;
        case 'create-ad':
          this.currentStep = 3;
          break;
        case 'summary':
          this.currentStep = 4;
          break;
        default:
          this.currentStep = 0;
          break;
      }
    }
  }
}
