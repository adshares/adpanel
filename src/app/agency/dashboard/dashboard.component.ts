import { Component } from '@angular/core';
import { HandleSubscription } from 'common/handle-subscription';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends HandleSubscription {}
