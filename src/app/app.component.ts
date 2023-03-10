import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { fadeAnimation } from 'common/animations/fade.animation';

import { AuthService } from 'app/auth.service';
import { SessionService } from 'app/session.service';
import { LoadInfo } from 'store/common/common.actions';

import { AppState } from 'models/app-state.model';
import { Info } from 'models/info.model';

import { appSettings } from 'app-settings';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation],
})
export class AppComponent extends HandleSubscriptionComponent implements OnInit {
  private readonly MODE_INITIALIZATION = 'initialization';
  name: string = null;
  info: Info = null;
  isLoaded = false;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private session: SessionService
  ) {
    super();
  }

  getRouterOutletState = outlet => (outlet.isActivated ? outlet.activatedRoute : '');

  ngOnInit(): void {
    if (window.location.href.match(/\/503(\?)?/)) {
      this.onMaintenanceRedirect();
      return;
    }
    this.name = environment.name;
    const infoSubscription = this.store.select('state', 'common', 'info').subscribe((info: Info) => {
      if (null === info) {
        this.onMaintenanceRedirect();
        return;
      }
      if (!this.isOauth() && environment.adControllerUrl && this.MODE_INITIALIZATION === info.mode) {
        window.location.href = environment.adControllerUrl;
        return;
      }
      this.info = info;
      this.isLoaded = true;
    });
    this.subscriptions.push(infoSubscription);
    this.loadInfo();

    this.auth.timeout();

    if (!this.session.getUser()) {
      return;
    }

    this.router.events.subscribe(event => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }

      setTimeout(() => window.scrollTo(0, 0), appSettings.ROUTER_TRANSITION_DURATION);
    });
  }

  loadInfo(): void {
    this.store.dispatch(new LoadInfo());
  }

  isOauth(): boolean {
    return undefined !== this.route.snapshot.queryParams.redirect_uri;
  }

  private onMaintenanceRedirect(): void {
    this.router.navigate(['/503']);
    this.isLoaded = true;
  }
}
