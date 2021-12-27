import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { HandleSubscription } from 'common/handle-subscription'
import { SessionService } from 'app/session.service'
import { AppState } from 'models/app-state.model'
import { Store } from '@ngrx/store'
import { UserAdserverWallet } from 'models/user.model'
import { CODE, CRYPTO } from 'common/utilities/consts'
import { environment } from 'environments/environment'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { clicksToAds } from 'common/utilities/helpers'
import { SettingsService } from 'settings/settings.service'
import { ConfirmResponseDialogComponent } from 'common/dialog/confirm-response-dialog/confirm-response-dialog.component'

@Component({
  selector: 'app-auto-withdrawal',
  templateUrl: './auto-withdrawal.component.html',
  styleUrls: ['./auto-withdrawal.component.scss'],
})
export class AutoWithdrawalComponent extends HandleSubscription implements OnInit {
  wallet: UserAdserverWallet
  crypto: string = CRYPTO
  code: string = CODE
  currencyCode: string = environment.currencyCode

  isAutoWithdrawalAvailable: boolean = false
  autoWithdrawalForm: FormGroup
  showAutoWithdrawalForm: boolean = false
  autoWithdrawalFormSubmitted: boolean = false
  errorWithdrawalSave = false

  minLimit: number = 100000000000
  defaultLimit: number = 1000000000000

  constructor (
    private dialog: MatDialog,
    private session: SessionService,
    private settingsService: SettingsService,
    private store: Store<AppState>,
  ) {
    super()
  }

  ngOnInit () {
    this.store.select('state', 'user', 'data', 'adserverWallet').take(1).
      subscribe((wallet: UserAdserverWallet) => {
        this.wallet = wallet
        this.showAutoWithdrawalForm = this.isAutoWithdrawalAvailable && wallet.isAutoWithdrawal
        const limit = clicksToAds(Math.max(this.minLimit,
          this.wallet.autoWithdrawalLimit || this.defaultLimit))
        this.autoWithdrawalForm = new FormGroup({
          limit: new FormControl(limit,
            // [Validators.required,
            // Validators.min(clicksToAds(this.minLimit))]),
            [Validators.required]),
        })
      })
  }

  changeAutoWithdraw (enabled: boolean) {
    this.showAutoWithdrawalForm = enabled
  }

  onAutoWithdrawalSave () {
    this.autoWithdrawalFormSubmitted = true
    if (!this.autoWithdrawalForm.valid) {
      return
    }
    this.errorWithdrawalSave = false
    console.debug('onAutoWithdrawalSave',
      this.autoWithdrawalForm.get('limit').value)

    const autoWithdrawal = this.wallet.isAutoWithdrawal
      ? this.autoWithdrawalForm.get('limit').value
      : null

    this.settingsService.changeAutoWithdrawal(autoWithdrawal).subscribe(
      () => {
        this.autoWithdrawalForm.reset()
        this.dialog.open(ConfirmResponseDialogComponent, {
          data: {
            title: 'Password changed',
            message: 'Your password has been changed as requested',
          },
        })
      },
      (err) => {
        this.errorWithdrawalSave = err.error.message
      },
      () => this.autoWithdrawalFormSubmitted = false,
    )
  }
}
