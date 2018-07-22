import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { timer } from 'rxjs/observable/timer';

import { HandleSubscription } from 'common/handle-subscription';
import { CommonService } from 'common/common.service';
import { AppState } from 'models/app-state.model';
import { fadeAnimation } from 'common/animations/fade.animation';
import { appSettings } from 'app-settings';
import { userRolesEnum } from 'models/enum/user.enum';
import { isUnixTimePastNow } from 'common/utilities/helpers';
import { User, LocalStorageUser } from 'models/user.model';
import { AdsharesAddress } from 'models/settings.model';
import { Notification } from 'models/notification.model';

import { AuthService } from 'auth/auth.service';
import { SessionService } from "app/session.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent extends HandleSubscription implements OnInit {
  updateNotificationTimer: Subscription;

  constructor(
    private router: Router,
    private auth: AuthService,
    private session: SessionService,
    private commonService: CommonService
  ) {
    super();
  }

  getRouterOutletState = (outlet) => outlet.isActivated ? outlet.activatedRoute : '';

  ngOnInit() {
    this.checkSessionTimeouts();
    if (!this.session.getUser()) {
      return;
    }

    this.getAdsharesAddress();
    this.setNotificationUptadeInterval();

    // TODO ? wtf wtf
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }

      setTimeout(() => window.scrollTo(0, 0), appSettings.ROUTER_TRANSITION_DURATION);
    });
  }

  // TODO: location?
  checkSessionTimeouts() {
    const user: LocalStorageUser = this.session.getUser();
    if (!user) {
      return;
    }
    if (isUnixTimePastNow(user.expiration)) {
      this.auth.logOut().subscribe(
        () => {
          this.session.dropUser();
          this.router.navigate(['/auth', 'login']);
        },
        () => {
          // error or no error we are logged out here
          this.session.dropUser();
          this.router.navigate(['/auth', 'login']);
        }
      );
    }
  }

  getAdsharesAddress() {
    if (this.session.getAdsharesAddress()) {
      return;
    }
    this.commonService.getAdsharesAddress()
      .subscribe((data: AdsharesAddress) => {
        this.session.setAdsharesAddress(data.adsharesAddress);
      });

  }

  getNotifications() {
    // TODO:fix
    this.commonService.getNotifications().subscribe(
      (notifications: Notification[]) => {
        this.session.setNotifications(notifications);
      }
    )
  }

  setNotificationUptadeInterval() {
    this.updateNotificationTimer = timer(0, appSettings.UPDATE_NOTIFICATION_MILLISECONDS_INTERVAL)
      .subscribe(() => this.getNotifications());
    this.subscriptions.push(this.updateNotificationTimer);
  }
}
