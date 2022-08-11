import { Component } from '@angular/core'
import { SessionService } from 'app/session.service'
import { LocalStorageUser, UserAdserverWallet } from 'models/user.model'
import { Store } from '@ngrx/store'
import { AppState } from 'models/app-state.model'
import { HandleSubscription } from 'common/handle-subscription'
import { CODE, CRYPTO } from 'common/utilities/consts'
import { take } from 'rxjs/operators'
import { ServerOptionsService } from 'common/server-options.service'

@Component({
  selector: 'app-settings-navigation',
  templateUrl: './settings-navigation.component.html',
  styleUrls: ['./settings-navigation.component.scss'],
})
export class SettingsNavigationComponent extends HandleSubscription {
  crypto: string = CRYPTO
  code: string = CODE
  calculateFunds: boolean
  wallet: UserAdserverWallet
  totalFunds: number
  user: LocalStorageUser
  settings = []

  constructor (
    private serverOptionsService: ServerOptionsService,
    private session: SessionService,
    private store: Store<AppState>,
  ) {
    super()

    if (session.isModerator()) {
      this.settings.push({
        title: 'Moderator',
        description: '',
        link: '/moderator/dashboard/users',
        values: [
          { name: 'Users List', icon: 'assets/images/user-gray.svg' },
          { name: 'Publishers', icon: 'assets/images/user-gray.svg' },
          { name: 'Advertisers', icon: 'assets/images/user-gray.svg' },
          { name: 'Reports', icon: 'assets/images/user-gray.svg' },
        ],
      })
    }

    if (session.isAgency()) {
      this.settings.push({
        title: 'Agency',
        description: '',
        link: '/agency/dashboard/users',
        values: [
          { name: 'Users List', icon: 'assets/images/user-gray.svg' },
          { name: 'Publishers', icon: 'assets/images/user-gray.svg' },
          { name: 'Reports', icon: 'assets/images/user-gray.svg' },
        ],
      })
    }

    this.settings.push({
      title: 'Account settings',
      description: '',
      link: '/settings/general',
      values: [
        { name: 'Wallet settings', icon: 'assets/images/preferences.svg' },
        { name: 'Email & password', icon: 'assets/images/preferences.svg' },
        { name: 'Referral links', icon: 'assets/images/preferences.svg' },
        { name: 'Newsletter', icon: 'assets/images/preferences.svg' },
      ],
    })

    if (!session.isModerator()) {
      this.settings.push({
        title: 'Billing & payments',
        description: '',
        link: '/settings/billing',
        values: [
          { name: 'Your wallet', icon: 'assets/images/wallet--gray.svg' },
          { name: 'Billing history', icon: 'assets/images/history.svg' },
        ],
      })
      this.settings.push({
        title: 'Reports',
        description: '',
        link: '/settings/reports',
        values: [
          { name: 'Reports', icon: 'assets/images/chevron--gray.svg' },
        ],
      })
    }
  }

  ngOnInit (): void {
    const optionsSubscription = this.serverOptionsService.getOptions()
      .pipe(take(1))
      .subscribe(options => {
        this.calculateFunds = options.displayCurrency !== options.appCurrency
      })
    this.subscriptions.push(optionsSubscription)

    this.user = this.session.getUser()
    const userDataStateSubscription = this.store.select('state', 'user', 'data',
      'adserverWallet', 'totalFunds').subscribe((totalFunds: number) => {
      this.totalFunds = totalFunds
    })
    this.subscriptions.push(userDataStateSubscription)
  }
}
