import { Component } from '@angular/core';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends HandleSubscriptionComponent {}
