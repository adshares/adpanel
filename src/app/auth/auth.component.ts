import { Component } from '@angular/core';

import { fadeAnimation } from 'common/animations/fade.animation';
import { environment } from "environments/environment";

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
    this.version = environment.version;
  }
}
