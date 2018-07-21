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

import { ConfirmNewChangeEmailComponent } from "auth/confirm-new-change-email/confirm-new-change-email.component";
import { ConfirmOldChangeEmailComponent } from "auth/confirm-old-change-email/confirm-old-change-email.component";

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
    const userData: LocalStorageUser = this.session.getUser();

    if (!userData) {
      return;
    }

    this.getAdsharesAddress();
    this.setNotificationUptadeInterval();

    // TODO ?
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }

      setTimeout(() => window.scrollTo(0, 0), appSettings.ROUTER_TRANSITION_DURATION);
    });
  }

  getAdsharesAddress() {
    this.commonService.getAdsharesAddress()
      .subscribe((data: AdsharesAddress) => {
        this.session.setAdsharesAddress(data.adsharesAddress);
      });

  }

  getNotifications() {
    // TODO:fix
    // this.store.dispatch(new commonActions.LoadNotifications(''));
  }

  setNotificationUptadeInterval() {
    this.updateNotificationTimer = timer(0, appSettings.UPDATE_NOTIFICATION_MILLISECONDS_INTERVAL)
      .subscribe(() => this.getNotifications());
    this.subscriptions.push(this.updateNotificationTimer);
  }

  checkRequestMissing() {
    //./src/app/common/request.interceptor.ts:65:        this.app.checkRequestMissing();
    const exludedComponent = ["email-activate", "confirm-old-change-email", "confirm-new-change-email"];
    let loginDir = true;
    for (let comp of exludedComponent) {
      if (location.pathname.indexOf(comp) > -1) {
        loginDir = false;
      }
    }
    const chooseAccount = localStorage.getItem("choose");
    if (loginDir) {
      if (chooseAccount == "Advertiser") {
        this.router.navigate(['/advertiser/dashboard']);
      } else {
        this.router.navigate(['/publisher/dashboard']);
      }
    }
    return loginDir;
  }
}
