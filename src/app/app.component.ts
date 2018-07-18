import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { timer } from 'rxjs/observable/timer';

import { HandleSubscription } from 'common/handle-subscription';
import { CommonService } from 'common/common.service';
import { AppState } from 'models/app-state.model';
import { fadeAnimation } from 'common/animations/fade.animation';
import { appSettings } from 'app-settings';
import { userRolesEnum } from 'models/enum/user.enum';
import { isUnixTimePastNow } from 'common/utilities/helpers';
import { User } from 'models/user.model';
import { LocalStorageUser } from 'models/user.model';
import { AdsharesAddress } from 'models/settings.model';
import { Notification } from 'models/notification.model';

import * as authActions from 'store/auth/auth.actions';
import * as commonActions from 'store/common/common.actions';
import {ConfirmNewChangeEmailComponent} from "auth/confirm-new-change-email/confirm-new-change-email.component";
import {ConfirmOldChangeEmailComponent} from "auth/confirm-old-change-email/confirm-old-change-email.component";

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
    private store: Store<AppState>,
    private commonService: CommonService
  ) {
    super();
  }

  getRouterOutletState = (outlet) => outlet.isActivated ? outlet.activatedRoute : '';

  ngOnInit() {
    const userData: LocalStorageUser = JSON.parse(localStorage.getItem('adshUser'))
    if(userData) {
        this.handleSavedUserData(userData);
        this.getAdsharesAddress();
        this.setNotificationUptadeInterval();
    }

    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }

      setTimeout(() => window.scrollTo(0, 0), appSettings.ROUTER_TRANSITION_DURATION);
    });
  }

  handleSavedUserData(userData) {
    if (Object.keys(userData).length == 0) {
      this.router.navigate(['/auth', 'login']);
      return;
    }
    const { remember, passwordLength, expiration, ...user } = userData;
    if (isUnixTimePastNow(userData.expiration) && Object.keys(userData).length > 0) {
      localStorage.removeItem('adshUser');
      this.router.navigate(['/auth', 'login']);
    } else {
      let loginDir = location.pathname.indexOf('auth') > -1;
      if(location.pathname === "/"){
        loginDir = true;
      }
      const activeUserType =
        loginDir ? this.getActiveUserTypeByUserRoles(user) : this.getActiveUserTypeByDir();

      this.store.dispatch(new authActions.SetUser(user));
      this.store.dispatch(new commonActions.SetActiveUserType(activeUserType));
      loginDir = this.checkRequestMissing();
      if (loginDir) {
        const moduleDir = `/${userRolesEnum[activeUserType].toLowerCase()}`;
        this.router.navigate([moduleDir, 'dashboard']);
      }
    }
  }

  getActiveUserTypeByUserRoles(user: User) {
    if (user.isAdmin) {
      return userRolesEnum.ADMIN;
    } else if (user.isAdvertiser) {
      return userRolesEnum.ADVERTISER;
    } else {
      return userRolesEnum.PUBLISHER;
    }
  }

  getActiveUserTypeByDir() {
    if (location.pathname.indexOf('admin') > -1) {
      return userRolesEnum.ADMIN;
    } else if (location.pathname.indexOf('advertiser') > -1) {
      return userRolesEnum.ADVERTISER;
    } else {
      return userRolesEnum.PUBLISHER;
    }
  }

  getAdsharesAddress() {
    const changeWithdrawAddressSubscription = this.commonService.getAdsharesAddress()
      .subscribe((data: AdsharesAddress) => {
        this.store.dispatch(new commonActions.SetAdsharesAddress(data.adsharesAddress));
      });

    this.subscriptions.push(changeWithdrawAddressSubscription);
  }

  getNotifications() {
    this.store.dispatch(new commonActions.LoadNotifications(''));
  }

  setNotificationUptadeInterval() {
    this.updateNotificationTimer = timer(0, appSettings.UPDATE_NOTIFICATION_MILLISECONDS_INTERVAL)
      .subscribe(() => this.getNotifications());
    this.subscriptions.push(this.updateNotificationTimer);
  }

  checkRequestMissing(){
      const exludedComponent = ["email-activate", "confirm-old-change-email", "confirm-new-change-email"];
      let loginDir = true;
      for(let comp of exludedComponent){
          if(location.pathname.indexOf(comp) > -1){
              loginDir = false;
          }
      }
      const chooseAccount = localStorage.getItem("choose");
      if(loginDir){
          if(chooseAccount == "Advertiser"){
              this.router.navigate(['/advertiser/dashboard']);
          } else {
              this.router.navigate(['/publisher/dashboard']);
          }
      }
      return loginDir;
  }
}