import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';

import { HandleSubscription } from 'common/handle-subscription';
import { CommonService } from 'common/common.service';
import { AppState } from 'models/app-state.model';
import { fadeAnimation } from 'common/animations/fade.animation';
import { appSettings } from 'app-settings';
import { userRolesEnum } from 'models/enum/user.enum';
import { isUnixTimePastNow } from 'common/utilities/helpers';
import { User } from 'models/user.model';
import { LocalStorageUser } from 'models/user.model';
import { AdSharesEthAddress } from 'models/settings.model';
import * as authActions from 'store/auth/auth.actions';
import * as commonActions from 'store/common/common.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent extends HandleSubscription implements OnInit {

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private commonService: CommonService
  ) {
    super();
  }

  getRouterOutletState = (outlet) => outlet.isActivated ? outlet.activatedRoute : '';

  ngOnInit() {
    this.handleSavedUserData();
    this.getAdsharesEthAddress();

    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }

      setTimeout(() => window.scrollTo(0, 0), appSettings.ROUTER_TRANSITION_DURATION);
    });
  }

  handleSavedUserData() {
    const userData: LocalStorageUser = JSON.parse(localStorage.getItem('adshUser'));

    if (!userData) {
      this.router.navigate(['/auth', 'login']);
      return;
    }

    const { remember, passwordLength, expiration, ...user } = userData;

    if (isUnixTimePastNow(userData.expiration)) {
      localStorage.removeItem('adshUser');
      this.router.navigate(['/auth', 'login']);
    } else {
      const loginDir = location.pathname.indexOf('auth') > -1;
      const activeUserType =
        loginDir ? this.getActiveUserTypeByUserRoles(user) : this.getActiveUserTypeByDir();

      this.store.dispatch(new authActions.SetUser(user));
      this.store.dispatch(new commonActions.SetActiveUserType(activeUserType));

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

  getAdsharesEthAddress() {
    const changeWithdrawAddressSubscription = this.commonService.getAdsharesEthAddress()
      .subscribe((data: AdSharesEthAddress) => {
        this.store.dispatch(new commonActions.SetAdsharesEthAddress(data.adsharesEthAddress));
      });

    this.subscriptions.push(changeWithdrawAddressSubscription);
  }
}
