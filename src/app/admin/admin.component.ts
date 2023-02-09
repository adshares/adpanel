import { Component } from '@angular/core';
import { fadeAnimation } from 'common/animations/fade.animation';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  animations: [fadeAnimation],
})
export class AdminComponent {
  getRouterOutletState = outlet => (outlet.isActivated ? outlet.activatedRoute : '');
}
