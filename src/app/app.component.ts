import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from "@ngrx/store";

import { HandleSubscription } from 'common/handle-subscription';
import { fadeAnimation } from 'common/animations/fade.animation';

import { AuthService } from 'app/auth.service';
import { SessionService } from "app/session.service";
import { LoadInfo } from "store/common/common.actions";

import { AppState } from "models/app-state.model";
import { Info } from "models/info.model";

import { appSettings } from 'app-settings';
import { environment } from "environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent extends HandleSubscription implements OnInit {
  name: string = null;
  info: Info = null;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private auth: AuthService,
    private session: SessionService,
  ) {
    super();
  }

  getRouterOutletState = (outlet) => outlet.isActivated ? outlet.activatedRoute : '';

  ngOnInit(): void {
    this.name = environment.name;
    const infoSubscription = this.store.select('state', 'common', 'info')
      .subscribe((info: Info) => {
        this.info = info;
      });
    this.subscriptions.push(infoSubscription);
    this.loadInfo();

    this.auth.timeout();

    if (!this.session.getUser()) {
      return;
    }

    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }

      setTimeout(() => window.scrollTo(0, 0), appSettings.ROUTER_TRANSITION_DURATION);
    });
  }

  loadInfo(): void {
    this.store.dispatch(new LoadInfo());
  }
}
