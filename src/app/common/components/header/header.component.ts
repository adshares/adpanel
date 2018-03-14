import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { HandleSubscription } from 'common/handle-subscription';
import { AppState } from 'models/app-state.model';
import { User } from 'models/user.model';
import { SetYourEarningsDialogComponent } from 'admin/dialogs/set-your-earnings-dialog/set-your-earnings-dialog.component';
import { AddFundsDialogComponent } from 'common/dialog/add-funds-dialog/add-funds-dialog.component';

import { userRolesEnum } from 'models/enum/user.enum';

import * as commonActions from 'store/common/common.actions';
import * as advertiserActions from 'store/advertiser/advertiser.actions';
import * as publisherActions from 'store/publisher/publisher.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends HandleSubscription implements OnInit {
  totalFunds: number;
  totalFundsInCurrency: number;
  notificationsCount = 8;
  userDataState: Store<User>;
  activeUserType: number;

  userRolesEnum = userRolesEnum;
  notificationsBarEnabled = false;

  settingsMenuOpen = false;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private dialog: MatDialog
  ) {
    super(null);
  }

  ngOnInit() {
    const activeUserTypeSubscription = this.store.select('state', 'common', 'activeUserType')
      .subscribe(activeUserType => {
        this.activeUserType = activeUserType;
      });

    const totalFundsSubscription = this.store.select('state', 'user', 'data')
      .subscribe((userData: User) => {
        this.totalFunds = userData.totalFunds;
        this.totalFundsInCurrency = userData.totalFundsInCurrency;
      });

    this.subscriptions.push(totalFundsSubscription, activeUserTypeSubscription);

    this.userDataState = this.store.select('state', 'user', 'data');
  }

  toggleNotificationsBar(status: boolean) {
    this.notificationsBarEnabled = status;
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

  openAddFundsDialog() {
    this.dialog.open(AddFundsDialogComponent);
  }
}
