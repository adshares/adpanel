import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { HandleSubscription } from 'common/handle-subscription';
import { AddFundsDialogComponent } from 'common/dialog/add-funds-dialog/add-funds-dialog.component';
import { userRolesEnum } from 'models/enum/user.enum';
import { AuthService } from 'app/auth.service';
import { SessionService } from "app/session.service";
import { Store } from "@ngrx/store";
import { AppState } from "models/app-state.model";
import { environment } from 'environments/environment';
import { SetUser } from "store/auth/auth.actions";
import { UserAdserverWallet } from "models/user.model";

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
  envContext: string | null = environment.context;

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
    this.store.dispatch(new SetUser());
    let accountType = this.session.getAccountTypeChoice();
    this.activeUserType = accountType === 'admin' ? userRolesEnum.ADMIN : (accountType === 'publisher' ? userRolesEnum.PUBLISHER : userRolesEnum.ADVERTISER);
    this.notificationsTotal = this.session.getNotificationsCount();
    const userDataStateSubscription = this.store.select('state', 'user', 'data', 'adserverWallet')
      .subscribe((wallet: UserAdserverWallet) => {
        this.totalFunds = wallet.totalFunds
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
