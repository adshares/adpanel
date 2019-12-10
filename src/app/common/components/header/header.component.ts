import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { HandleSubscription } from 'common/handle-subscription';
import { AddFundsDialogComponent } from 'common/dialog/add-funds-dialog/add-funds-dialog.component';
import { userRolesEnum } from 'models/enum/user.enum';
import { AuthService } from 'app/auth.service';
import { SessionService } from 'app/session.service';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import { User } from 'models/user.model';
import { environment } from 'environments/environment';
import { SetUser } from 'store/auth/auth.actions';
import { CODE, CRYPTO } from 'common/utilities/consts';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends HandleSubscription implements OnInit {
  crypto: string = CRYPTO;
  code: string = CODE;
  totalFunds: number;
  isTotalFundsValid: boolean = false;
  activeUserType: number;
  userRolesEnum = userRolesEnum;
  settingsMenuOpen = false;
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
    const accountType = this.session.getAccountTypeChoice();
    this.activeUserType = accountType === SessionService.ACCOUNT_TYPE_ADMIN
      ? userRolesEnum.ADMIN
      : (accountType === SessionService.ACCOUNT_TYPE_PUBLISHER ? userRolesEnum.PUBLISHER : userRolesEnum.ADVERTISER);
    this.notificationsTotal = this.session.getNotificationsCount();
    const userDataStateSubscription = this.store.select('state', 'user', 'data')
      .subscribe((data: User) => {
        this.totalFunds = data.adserverWallet.totalFunds;
        this.isTotalFundsValid = data.isAdserverWalletValid;
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
}
