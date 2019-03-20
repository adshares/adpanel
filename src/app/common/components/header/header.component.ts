import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { HandleSubscription } from 'common/handle-subscription';
import { User } from 'models/user.model';
import { AddFundsDialogComponent } from 'common/dialog/add-funds-dialog/add-funds-dialog.component';
import { userRolesEnum } from 'models/enum/user.enum';
import { AuthService } from 'app/auth.service';
import { SessionService } from "app/session.service";
import { Store } from "@ngrx/store";
import { AppState, SettingsState } from "models/app-state.model";
import { GetCurrentBalance } from 'store/settings/settings.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends HandleSubscription implements OnInit {
  totalFunds: number;
  activeUserType: number;
  userRolesEnum = userRolesEnum;
  settingsMenuOpen = false;
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
    this.store.dispatch(new GetCurrentBalance());
    let accountType = this.session.getAccountTypeChoice();
    this.activeUserType = accountType === 'admin' ? userRolesEnum.ADMIN : (accountType === 'publisher' ? userRolesEnum.PUBLISHER : userRolesEnum.ADVERTISER);
    this.notificationsTotal = this.session.getNotificationsCount();
    const userDataStateSubscription = this.store.select('state', 'user', 'settings')
      .subscribe((state: SettingsState) => {
        this.totalFunds = state.totalFunds
      });
    this.subscriptions.push(userDataStateSubscription);
  }

  navigateToCreateNewAsset() {
    const moduleDir = `/${userRolesEnum[this.activeUserType].toLowerCase()}`;
    const isUserAdvertiser = this.activeUserType === userRolesEnum.ADVERTISER;
    const assetDir = isUserAdvertiser ? 'create-campaign' : 'create-site';

    this.router.navigate(
      [moduleDir, assetDir, 'basic-information'],
      {queryParams: {step: 1}}
    );
  }

  setActiveUserType(userType) {
    this.session.setAccountTypeChoice(userRolesEnum[userType].toLowerCase());
    this.router.navigate([`/${userRolesEnum[userType].toLowerCase()}`, 'dashboard'])
  }

  toggleSettingsMenu(state) {
    this.settingsMenuOpen = state;
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
