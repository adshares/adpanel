import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';

import { HandleSubscription } from '../../handle-subscription';
import { AppState } from '../../../models/app-state.model';
import { userRolesEnum } from '../../../models/enum/user.enum';
import { enumToObject } from '../../../common/utilities/helpers';

import * as authActions from '../../../store/auth/auth.action';
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
  userDataState: any;
  activeUserType: string;
  userRoles: { [key: string]: string } = enumToObject(userRolesEnum);

  notificationsBarEnabled = false;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super(null);

    this.userDataState = this.store.select('state', 'user', 'data');
  }

  ngOnInit() {
    this.setActiveUserType();
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

  setActiveUserType() {
    this.store.select('state', 'user', 'data')
      .take(1)
      .subscribe((userData) => {
        if (this.route.snapshot.routeConfig.path !== 'settings') {
          this.store.dispatch(new authActions.SetActiveUserType(this.route.snapshot.routeConfig.path));
        }
        this.activeUserType = userData.activeUserType;
      });
  }
}
