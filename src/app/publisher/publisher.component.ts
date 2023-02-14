import { Component } from '@angular/core';
import { fadeAnimation } from 'common/animations/fade.animation';

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  animations: [fadeAnimation],
})
export class PublisherComponent {
  getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
