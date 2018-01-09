import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { UserModel } from '../../../models/user.model';
import { HandleSubscription } from '../../handle-subscription';
import { AppState } from '../../../models/app-state.model';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends HandleSubscription implements OnInit {
  currentBalanceAdst: number = 128.20;
  currentBalanceUSD: number = 1240.02;
  notificationsCount: number = 8;
  selectedRole = 'Admin';
  userDataState: Store<UserModel>;
  activeUserType: string;

  notificationsBarEnabled: boolean = false;

  constructor(private store: Store<AppState>,
              private router: Router,
              private route: ActivatedRoute) {
    super(null);

    this.userDataState = this.store.select('state', 'auth', 'userData');
  }

  ngOnInit() {
    const getUserSubscription = this.userDataState
      .subscribe((userData: UserModel) => this.checkUserRole(userData));
    this.subscriptions.push(getUserSubscription);

    this.activeUserType = this.route.snapshot.routeConfig.path;

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

  checkUserRole(user: UserModel) {
    if (user.isAdmin) {
      return;
    }

    this.selectedRole = user.isAdvertiser ? 'Advertiser' : 'Publisher';
  }
}
