import { Component } from '@angular/core';

import { fadeAnimation } from 'common/animations/fade.animation';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  animations: [fadeAnimation]
})
export class AdminComponent {
  getRouterOutletState = (outlet) => outlet.isActivated ? outlet.activatedRoute : '';
}
