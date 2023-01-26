import { Component } from '@angular/core';

import { fadeAnimation } from 'common/animations/fade.animation';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [fadeAnimation],
})
export class SettingsComponent {
  getRouterOutletState = outlet => (outlet.isActivated ? outlet.activatedRoute : '');
}
