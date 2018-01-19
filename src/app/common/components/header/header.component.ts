import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { User } from '../../../models/user.model';
import { HandleSubscription } from '../../handle-subscription';
import { AppState } from '../../../models/app-state.model';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

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

  notificationsBarEnabled = false;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(null);

    this.userDataState = this.store.select('state', 'user', 'data');
  }

  ngOnInit() {
    this.activeUserType = this.route.snapshot.routeConfig.path === ('publisher' || 'advertiser')
                          ? this.route.snapshot.routeConfig.path
                          : 'advertiser';

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
}
