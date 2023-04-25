import { Component, OnInit } from '@angular/core';
import { SessionService } from 'app/session.service';
import { LocalStorageUser, UserAdserverWallet } from 'models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { CODE, CRYPTO } from 'common/utilities/consts';
import { ServerOptionsService } from 'common/server-options.service';

@Component({
  selector: 'app-settings-navigation',
  templateUrl: './settings-navigation.component.html',
  styleUrls: ['./settings-navigation.component.scss'],
})
export class SettingsNavigationComponent extends HandleSubscriptionComponent implements OnInit {
  crypto: string = CRYPTO;
  code: string = CODE;
  calculateFunds: boolean;
  wallet: UserAdserverWallet;
  totalFunds: number;
  user: LocalStorageUser;
  settings = [];

  constructor(
    private serverOptionsService: ServerOptionsService,
    private session: SessionService,
    private store: Store<AppState>
  ) {
    super();

    if (session.isModerator()) {
      this.settings.push({
        title: 'Moderator',
        description: '',
        link: '/moderator/dashboard/users',
        values: [
          { name: 'Users List', path: '/all' },
          { name: 'Publishers', path: '/publishers' },
          { name: 'Advertisers', path: '/advertisers' },
          { name: 'Reports', path: '/reports' },
        ],
      });
    }

    if (session.isAgency()) {
      this.settings.push({
        title: 'Agency',
        description: '',
        link: '/agency/dashboard/users',
        values: [
          { name: 'Users List', path: '/all' },
          { name: 'Publishers', path: '/publishers' },
          { name: 'Advertisers', path: '/advertisers' },
          { name: 'Reports', path: '/reports' },
        ],
      });
    }

    this.settings.push({
      title: 'Account settings',
      description: '',
      link: '/settings/general',
      values: [
        { name: 'Wallet', path: '/wallet' },
        { name: 'Email & password', path: '/preferences' },
        { name: 'Referral links', path: '/referrals' },
        { name: 'Access tokens', path: '/access-token' },
        { name: 'Newsletter', path: '/newsletter' },
      ],
    });

    if (!session.isModerator() || session.isImpersonated()) {
      this.settings.push({
        title: 'Billing & payments',
        description: '',
        link: '/settings/billing',
        values: [
          { name: 'Your wallet', path: '/wallet' },
          { name: 'Billing history', path: '/history' },
        ],
      });
      this.settings.push({
        title: 'Reports',
        description: '',
        link: '/settings/reports',
        values: [{ name: 'Reports', path: '' }],
      });
    }
  }

  ngOnInit(): void {
    const options = this.serverOptionsService.getOptions();
    this.calculateFunds = options.displayCurrency !== options.appCurrency;

    this.user = this.session.getUser();
    const userDataStateSubscription = this.store
      .select('state', 'user', 'data', 'adserverWallet', 'totalFunds')
      .subscribe((totalFunds: number) => {
        this.totalFunds = totalFunds;
      });
    this.subscriptions.push(userDataStateSubscription);
  }
}
