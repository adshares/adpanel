import { Component, OnInit } from '@angular/core';
import { faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons'
import { AppState } from 'models/app-state.model';
import { GetLicense, LoadAdminSettings } from 'store/admin/admin.actions'
import { Store } from '@ngrx/store';
import { HandleSubscription } from 'common/handle-subscription';
import { License } from 'models/settings.model';
import { AdminService } from 'admin/admin.service';
import { take } from 'rxjs/operators';
import { environment } from 'environments/environment'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends HandleSubscription implements OnInit {
  readonly faExternalLinkSquareAlt = faExternalLinkSquareAlt
  adControllerUrl = environment.adControllerUrl
  isPanelBlocked: boolean = false;
  licenseDetailUrl: string = null;
  settings = [
    {
      title: 'Users',
      description: '',
      link: '/admin/dashboard/users',
      values: [
        {name: 'Users List', icon: 'assets/images/user-gray.svg'},
        {name: 'Publishers', icon: 'assets/images/user-gray.svg'},
        {name: 'Advertisers', icon: 'assets/images/user-gray.svg'},
        {name: 'Reports', icon: 'assets/images/user-gray.svg'},
      ],
    },
    {
      title: 'General settings',
      description: '',
      link: '/admin/dashboard/general',
      values: [
        {name: 'Bid strategy', icon: 'assets/images/preferences.svg'},
      ],
    },
    {
      title: 'Wallet settings',
      description: '',
      link: '/admin/dashboard/account',
      values: [
        {name: 'Account Wallet', icon: 'assets/images/preferences.svg'},
        {name: 'Email & password', icon: 'assets/images/preferences.svg'},
        {name: 'Referral links', icon: 'assets/images/preferences.svg'},
        {name: 'Newsletter', icon: 'assets/images/preferences.svg'},
      ],
    },
  ];

  constructor(
    private adminService: AdminService,
    private store: Store<AppState>,
  ) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(new LoadAdminSettings());
    this.store.dispatch(new GetLicense());
    const adminStoreSettingsSubscription = this.store.select('state', 'admin', 'panelBlockade')
      .subscribe((isBlocked: boolean) => {
        this.isPanelBlocked = isBlocked;
        if (isBlocked) {
          const licenseSubscription = this.store.select('state', 'admin', 'license')
            .pipe(take(1))
            .subscribe((license: License) => {
              this.licenseDetailUrl = license.detailsUrl;
            });
          this.subscriptions.push(licenseSubscription);
        }
      });
    this.subscriptions.push(adminStoreSettingsSubscription);
  }
}

