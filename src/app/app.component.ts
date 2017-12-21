import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { fadeAnimation } from './common/animations/fade.animation';
import { CONSTANT } from '../app-settings/app-settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit {

  constructor(private router: Router) {}

  getRouterOutletState = (outlet) => outlet.isActivated ? outlet.activatedRoute : '';

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, CONSTANT.routerTransitionDuration);
    });
  }
}
