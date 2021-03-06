import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { timer } from 'rxjs/observable/timer';

import { HandleSubscription } from 'common/handle-subscription';
import { CommonService } from 'common/common.service';
import { fadeAnimation } from 'common/animations/fade.animation';
import { appSettings } from 'app-settings';
import { Notification } from 'models/notification.model';

import { AuthService } from 'app/auth.service';
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
    this.auth.timeout();

    if (!this.session.getUser()) {
      return;
    }

    // TODO PAN-183 remove notification
    // this.setNotificationUpdateInterval();

    // TODO ? wtf wtf
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }

      setTimeout(() => window.scrollTo(0, 0), appSettings.ROUTER_TRANSITION_DURATION);
    });
  }

  getNotifications() {
    if (!this.session.getUser()) {
      return;
    }
    this.commonService.getNotifications().subscribe(
      (notifications: Notification[]) => {
        this.session.setNotifications(notifications);
      }
    )
  }

  setNotificationUpdateInterval() {
    this.updateNotificationTimer = timer(0, appSettings.UPDATE_NOTIFICATION_MILLISECONDS_INTERVAL)
      .subscribe(() => this.getNotifications());
    this.subscriptions.push(this.updateNotificationTimer);
  }
}
