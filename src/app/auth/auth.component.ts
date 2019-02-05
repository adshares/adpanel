import { Component } from '@angular/core';

import { fadeAnimation } from 'common/animations/fade.animation';
import { VERSION } from 'version';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  animations: [fadeAnimation]
})

export class AuthComponent {
  getRouterOutletState = (outlet) => outlet.isActivated ? outlet.activatedRoute : '';

  version: string;

  constructor(
  ) {
    this.version = VERSION;
  }
}
