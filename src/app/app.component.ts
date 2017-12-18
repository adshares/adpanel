import { Component } from '@angular/core';
import { fadeAnimation } from './common/animations/fade.animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent {
  getRouterOutletState = (outlet) => outlet.isActivated ? outlet.activatedRoute : '';
}
