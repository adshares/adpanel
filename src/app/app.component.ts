import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppState } from './models/app-state.model';
import { User, LocalStorageUser } from './models/user.model';
import { fadeAnimation } from './common/animations/fade.animation';
import { appSettings } from '../app-settings/app-settings';
import * as authActions from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) { }

  getRouterOutletState = (outlet) => outlet.isActivated ? outlet.activatedRoute : '';

  ngOnInit() {
    this.handleSavedUserData();
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }

      setTimeout(() => window.scrollTo(0, 0), appSettings.ROUTER_TRANSITION_DURATION);
    });
  }

  handleSavedUserData() {
    if (this.router.url.indexOf('auth') > -1) {
      return;
    }

    const userData: LocalStorageUser = JSON.parse(localStorage.getItem('adshUser'));
    const nowUnix = (+new Date) / 1000 | 0;

    if (!userData) {
      this.router.navigate(['/auth', 'login']);
      return;
    }

    const user = (({id, email, isAdvertiser, isPublisher, isAdmin, authToken}) =>
      ({id, email, isAdvertiser, isPublisher, isAdmin, authToken}))(userData);

    if (userData.expiration < nowUnix) {
      localStorage.removeItem('adshUser');
      this.router.navigate(['/auth', 'login']);
    } else {
      this.store.dispatch(new authActions.SetUser(user));
    }
  }
}
