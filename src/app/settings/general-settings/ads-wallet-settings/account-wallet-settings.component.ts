import { Component } from '@angular/core'
import { LocalStorageUser } from 'models/user.model'
import { SessionService } from '../../../session.service'
import { HandleSubscription } from 'common/handle-subscription'

@Component({
  selector: 'app-account-wallet-settings',
  templateUrl: './account-wallet-settings.component.html',
  styleUrls: ['./account-wallet-settings.component.scss'],
})
export class AccountWalletSettingsComponent extends HandleSubscription {
  user: LocalStorageUser

  constructor (
    private session: SessionService,
  ) {
    super()
  }

  ngOnInit () {
    this.user = this.session.getUser()
  }
}
