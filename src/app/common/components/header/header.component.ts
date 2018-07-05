import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { HandleSubscription } from 'common/handle-subscription';
import { AppState } from 'models/app-state.model';
import { User, UserAdserverWallet } from 'models/user.model';
import { Notification } from 'models/notification.model';
import { SetYourEarningsDialogComponent } from 'admin/dialogs/set-your-earnings-dialog/set-your-earnings-dialog.component';
import { AddFundsDialogComponent } from 'common/dialog/add-funds-dialog/add-funds-dialog.component';
import { userRolesEnum } from 'models/enum/user.enum';
import { userInitialState } from 'models/initial-state/user';
import { AuthService } from 'auth/auth.service';

import * as commonActions from 'store/common/common.actions';
import * as advertiserActions from 'store/advertiser/advertiser.actions';
import * as publisherActions from 'store/publisher/publisher.actions';
import * as authActions from 'store/auth/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends HandleSubscription implements OnInit {
  adserverWallet: UserAdserverWallet;
  userDataState: Store<User>;
  activeUserType: number;

  userRolesEnum = userRolesEnum;

  settingsMenuOpen = false;
  chooseUserMenuOpen = false;
  notificationsBarOpen = false;

  notificationsTotal: number;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    const activeUserTypeSubscription = this.store.select('state', 'common', 'activeUserType')
      .subscribe(activeUserType => {
        this.activeUserType = activeUserType;
      });

    const userAdserverWalletSubscription = this.store.select('state', 'user', 'data', 'adserverWallet')
      .subscribe((adserverWallet: UserAdserverWallet) => {
        this.adserverWallet = adserverWallet;
      });

    const notificationsTotalSubscription = this.store.select('state', 'common', 'notifications')
      .subscribe((notificationsList: Notification[]) => {
        this.notificationsTotal = notificationsList.length;
      });

    this.subscriptions.push(userAdserverWalletSubscription, activeUserTypeSubscription, notificationsTotalSubscription);
    this.userDataState = this.store.select('state', 'user', 'data');


  }

  navigateToCreateNewAsset() {
    const moduleDir =  `/${userRolesEnum[this.activeUserType].toLowerCase()}`;
    const isUserAdvertiser = this.activeUserType === userRolesEnum.ADVERTISER;
    const assetDir = isUserAdvertiser ? 'create-campaign' : 'create-site';

    if (isUserAdvertiser) {
      this.store.dispatch(new advertiserActions.ClearLastEditedCampaign(''));
    } else {
      this.store.dispatch(new publisherActions.ClearLastEditedSite(''));
    }

    this.router.navigate(
      [ moduleDir, assetDir, 'basic-information'],
      { queryParams: { step: 1 } }
    );
  }

  openSetEarningsDialog() {
    this.dialog.open(SetYourEarningsDialogComponent);
  }

  setActiveUserType(userType) {
    this.store.dispatch(new commonActions.SetActiveUserType(userType));
  }

  toggleSettingsMenu(state) {
    this.settingsMenuOpen = state;
  }

  toggleChooseUserMenu(state) {
    this.chooseUserMenuOpen = state;
  }

  openAddFundsDialog() {
    this.dialog.open(AddFundsDialogComponent);
  }

  logOut() {
    this.store.dispatch(new authActions.SetUser(userInitialState));
    const logoutSubscription = this.authService.logOut().subscribe();
    localStorage.removeItem('adshUser');
    this.router.navigate(['/auth', 'login']);
    this.subscriptions.push(logoutSubscription);
  }

  toggleNotificationsBar() {
    this.notificationsBarOpen = !this.notificationsBarOpen;
  }
}
