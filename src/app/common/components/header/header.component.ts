import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { HandleSubscription } from 'common/handle-subscription';
import { LocalStorageUser, UserAdserverWallet } from 'models/user.model';
import { SetYourEarningsDialogComponent } from 'admin/dialogs/set-your-earnings-dialog/set-your-earnings-dialog.component';
import { AddFundsDialogComponent } from 'common/dialog/add-funds-dialog/add-funds-dialog.component';
import { userRolesEnum } from 'models/enum/user.enum';
import { AuthService } from 'app/auth.service';
import { SessionService } from "app/session.service";
import {Store} from "@ngrx/store";
import {AppState} from "models/app-state.model";
import * as settingsActions from 'store/settings/settings.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends HandleSubscription implements OnInit {
  adserverWallet: UserAdserverWallet;
  activeUserType: number;

  userRolesEnum = userRolesEnum;
  userDataState: LocalStorageUser;

  settingsMenuOpen = false;
  chooseUserMenuOpen = false;
  notificationsBarOpen = false;

  notificationsTotal: number;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    public auth: AuthService,
    private session: SessionService,
    private store: Store<AppState>

  ) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(new settingsActions.GetCurrentBalance());
    let accountType = this.session.getAccountTypeChoice();
    this.activeUserType = accountType == 'admin' ? userRolesEnum.ADMIN : (accountType == 'publisher' ? userRolesEnum.PUBLISHER : userRolesEnum.ADVERTISER);
    this.userDataState = this.session.getUser();
    this.notificationsTotal = this.session.getNotificationsCount();
  }

  navigateToCreateNewAsset() {
    const moduleDir = `/${userRolesEnum[this.activeUserType].toLowerCase()}`;
    const isUserAdvertiser = this.activeUserType === userRolesEnum.ADVERTISER;
    const assetDir = isUserAdvertiser ? 'create-campaign' : 'create-site';

    // if (isUserAdvertiser) {
    //   this.store.dispatch(new advertiserActions.ClearLastEditedCampaign(''));
    // } else {
    //   this.store.dispatch(new publisherActions.ClearLastEditedSite(''));
    // }

    this.router.navigate(
      [moduleDir, assetDir, 'basic-information'],
      {queryParams: {step: 1}}
    );
  }

  openSetEarningsDialog() {
    this.dialog.open(SetYourEarningsDialogComponent);
  }

  setActiveUserType(userType) {
    this.session.setAccountTypeChoice(userRolesEnum[userType].toLowerCase());
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

  logout() {
    this.auth.logout();
  }

  toggleNotificationsBar() {
    this.notificationsBarOpen = !this.notificationsBarOpen;
  }
}
