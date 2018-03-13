import { Component } from '@angular/core';

import { fadeAnimation } from 'common/animations/fade.animation';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  animations: [fadeAnimation]
})

export class AuthComponent {
  getRouterOutletState = (outlet) => outlet.isActivated ? outlet.activatedRoute : '';
}
