import { Component } from '@angular/core';
import { fadeAnimation } from 'common/animations/fade.animation';

@Component({
  selector: 'app-advertiser',
  templateUrl: './advertiser.component.html',
  animations: [fadeAnimation],
})
export class AdvertiserComponent {
  getRouterOutletState = outlet => (outlet.isActivated ? outlet.activatedRoute : '');
}
