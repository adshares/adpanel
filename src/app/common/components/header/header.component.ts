import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { User } from '../../../models/user.model';
import { HandleSubscription } from '../../handle-subscription';
import { AppState } from '../../../models/app-state.model';
import { userRolesEnum } from '../../../models/enum/user.enum';
import { enumToObject } from '../../../common/utilis/helpers';

import * as advertiserActions from '../../../store/advertiser/advertiser.action';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends HandleSubscription implements OnInit {
  currentBalanceAdst = 128.20;
  currentBalanceUSD = 1240.02;
  notificationsCount = 8;
  userDataState: Store<User>;
  activeUserType: string;
  userRoles: { [key: string]: string } = enumToObject(userRolesEnum);

  notificationsBarEnabled = false;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(null);

    this.userDataState = this.store.select('state', 'auth', 'userData');
  }

  ngOnInit() {
    this.activeUserType =
      this.route.snapshot.routeConfig.path === (this.userRoles.ADVERTISER || this.userRoles.PUBLISHER)
        ? this.route.snapshot.routeConfig.path
        : this.userRoles.ADVERTISER;

    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      this.activeUserType = this.route.snapshot.routeConfig.path;
    });
  }

  toggleNotificationsBar(status: boolean) {
    this.notificationsBarEnabled = status;
  }

  navigateToCreateNewAsset() {
    const moduleDir =  `/${this.activeUserType}`
    const assetDir = this.activeUserType === this.userRoles.ADVERTISER ? 'create-campaign' : 'create-site';

    this.store.dispatch(new advertiserActions.ClearLastEditedCampaign(''));

    this.router.navigate(
      [ moduleDir, assetDir, 'basic-information'],
      { queryParams: { step: 1 } }
    );
  }
}
