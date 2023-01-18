import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { SessionService } from 'app/session.service';
import { AppState } from 'models/app-state.model';
import { Store } from '@ngrx/store';
import { User, UserAdserverWallet } from 'models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { adsToClicks, clicksToAds } from 'common/utilities/helpers';
import { SettingsService } from 'settings/settings.service';
import { ConfirmResponseDialogComponent } from 'common/dialog/confirm-response-dialog/confirm-response-dialog.component';
import { ServerOptionsService } from 'common/server-options.service';

@Component({
  selector: 'app-auto-withdrawal',
  templateUrl: './auto-withdrawal.component.html',
  styleUrls: ['./auto-withdrawal.component.scss'],
})
export class AutoWithdrawalComponent extends HandleSubscriptionComponent implements OnInit {
  wallet: UserAdserverWallet;
  currencyCode: string;
  isImpersonated: boolean = false;

  isAutoWithdrawalAvailable: boolean = false;
  autoWithdrawalForm: FormGroup;
  showAutoWithdrawalForm: boolean = false;
  autoWithdrawalFormSubmitted: boolean = false;
  errorWithdrawalSave = false;

  defaultLimit: number = 1000000000000;

  constructor(
    private dialog: MatDialog,
    private serverOptionsService: ServerOptionsService,
    private session: SessionService,
    private settingsService: SettingsService,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit(): void {
    this.currencyCode = this.serverOptionsService.getOptions().displayCurrency;
    this.store
      .select('state', 'user', 'data', 'adserverWallet')
      .pipe(take(2))
      .subscribe((wallet: UserAdserverWallet) => {
        this.updateWallet(wallet);
      });
    this.isImpersonated = this.session.isImpersonated();
  }

  updateWallet(wallet: UserAdserverWallet) {
    this.wallet = wallet;
    this.isAutoWithdrawalAvailable = wallet.walletNetwork === 'ADS' || wallet.walletNetwork === 'BSC';
    this.showAutoWithdrawalForm = wallet.isAutoWithdrawal;
    const limit = clicksToAds(Math.max(0, this.wallet.autoWithdrawalLimit || this.defaultLimit));
    this.autoWithdrawalForm = new FormGroup({
      limit: new FormControl(limit, [Validators.required]),
    });
  }

  changeAutoWithdraw(enabled: boolean): void {
    this.wallet = {
      ...this.wallet,
      isAutoWithdrawal: enabled,
    };
    this.showAutoWithdrawalForm = enabled;
  }

  onAutoWithdrawalSave() {
    this.autoWithdrawalFormSubmitted = true;
    if (!this.autoWithdrawalForm.valid) {
      return;
    }
    this.errorWithdrawalSave = false;

    const autoWithdrawal = this.wallet.isAutoWithdrawal
      ? adsToClicks(this.autoWithdrawalForm.get('limit').value)
      : null;

    this.settingsService.changeAutoWithdrawal(autoWithdrawal).subscribe(
      (user: User) => {
        this.updateWallet(user.adserverWallet);
        this.dialog.open(ConfirmResponseDialogComponent, {
          data: {
            title: 'Auto withdrawal changed',
            message: 'Your withdrawal settings has been changed as requested',
          },
        });
      },
      err => {
        this.errorWithdrawalSave = err.error.message;
      },
      () => (this.autoWithdrawalFormSubmitted = false)
    );
  }
}
