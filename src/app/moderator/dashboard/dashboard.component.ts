import { Component } from '@angular/core';
import { faGears } from '@fortawesome/free-solid-svg-icons';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends HandleSubscriptionComponent {
  readonly faGears = faGears;
  adControllerUrl = environment.adControllerUrl;
}
