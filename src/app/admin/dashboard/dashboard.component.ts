import { Component, OnInit } from '@angular/core';
import { faGears } from '@fortawesome/free-solid-svg-icons';
import { AppState } from 'models/app-state.model';
import { GetLicense, LoadAdminSettings } from 'store/admin/admin.actions';
import { Store } from '@ngrx/store';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { License } from 'models/settings.model';
import { AdminService } from 'admin/admin.service';
import { take } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends HandleSubscriptionComponent implements OnInit {
  readonly faGears = faGears;
  adControllerUrl = environment.adControllerUrl;
  isPanelBlocked: boolean = false;
  licenseDetailUrl: string = null;
  settings = [
    {
      title: 'Users',
      description: '',
      link: '/admin/dashboard/users',
      values: [
        { name: 'Users List', path: '/all' },
        { name: 'Publishers', path: '/publishers' },
        { name: 'Advertisers', path: '/advertisers' },
        { name: 'Reports', path: '/reports' },
      ],
    },
    {
      title: 'General settings',
      description: '',
      link: '/admin/dashboard/general',
      values: [{ name: 'Bid strategy', path: '' }],
    },
    {
      title: 'Wallet settings',
      description: '',
      link: '/admin/dashboard/account',
      values: [
        { name: 'Account wallet', path: '/wallet' },
        { name: 'Email & password', path: '/preferences' },
        { name: 'Referral links', path: '/referrals' },
        { name: 'Access tokens', path: '/access-token' },
        { name: 'Newsletter', path: '/newsletter' },
      ],
    },
  ];

  constructor(private adminService: AdminService, private store: Store<AppState>) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(new LoadAdminSettings());
    this.store.dispatch(new GetLicense());
    const adminStoreSettingsSubscription = this.store
      .select('state', 'admin', 'panelBlockade')
      .subscribe((isBlocked: boolean) => {
        this.isPanelBlocked = isBlocked;
        if (isBlocked) {
          const licenseSubscription = this.store
            .select('state', 'admin', 'license')
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
