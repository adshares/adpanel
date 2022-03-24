import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { Store } from "@ngrx/store";

import { HandleSubscription } from 'common/handle-subscription';
import { CommonService } from 'common/common.service';
import { fadeAnimation } from 'common/animations/fade.animation';

import { AuthService } from 'app/auth.service';
import { SessionService } from "app/session.service";
import { LoadInfo } from "store/common/common.actions";

import { AppState } from "models/app-state.model";
import { Info } from "models/info.model";
import { Notification } from 'models/notification.model';

import { appSettings } from 'app-settings';
import { environment } from "environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent extends HandleSubscription implements OnInit {
  updateNotificationTimer: Subscription;
  name: string = null;
  info: Info = null;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private auth: AuthService,
    private session: SessionService,
    private commonService: CommonService
  ) {
    super();
  }

  getRouterOutletState = (outlet) => outlet.isActivated ? outlet.activatedRoute : '';

  ngOnInit() {
    this.name = environment.name;
    const infoSubscription = this.store.select('state', 'common', 'info')
      .subscribe((info: Info) => {
        this.info = info;
      });
    this.subscriptions.push(infoSubscription);
    this.loadInfo();

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

  loadInfo() {
    this.store.dispatch(new LoadInfo());
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
