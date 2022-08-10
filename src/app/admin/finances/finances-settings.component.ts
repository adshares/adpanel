import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import { HandleSubscription } from 'common/handle-subscription';
import { LoadAdminWallet, SetAdminSettings } from 'store/admin/admin.actions';
import { ShowDialogOnError } from 'store/common/common.actions';
import { AdminSettings, AdminWallet } from 'models/settings.model';
import { CODE, CRYPTO } from 'common/utilities/consts';

@Component({
  selector: 'app-finances-settings',
  templateUrl: './finances-settings.component.html',
  styleUrls: ['./finances-settings.component.scss'],
  host: {'class': 'app-finances'},
})
export class FinancesSettingsComponent extends HandleSubscription implements OnInit {
  readonly ADS_TOKEN_CODE: string = 'ADS';
  crypto: string = CRYPTO;
  code: string = CODE;
  settings: AdminSettings;
  wallet: AdminWallet;
  canSubmit: boolean = false;
  referralRefundMessage: string = null;

  constructor(private store: Store<AppState>) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(new LoadAdminWallet());

    const adminStoreSettingsSubscription = this.store.select('state', 'admin', 'settings')
      .subscribe((settings: AdminSettings) => {
        this.settings = settings;
      });

    this.subscriptions.push(adminStoreSettingsSubscription);

    const adminStoreWalletSubscription = this.store.select('state', 'admin', 'wallet')
      .subscribe((wallet: AdminWallet) => {
        this.wallet = wallet;
      });

    this.subscriptions.push(adminStoreWalletSubscription);
  }

  updateSettings(value: number | boolean | string, key: string): void {
    if (`${value}`.length === 0) {
      this.canSubmit = false;
      return;
    }
    this.canSubmit = true;
    if (key === 'coldWalletAddress') {
      if (typeof value === 'string') {
        this.settings = {
          ...this.settings,
          coldWalletAddress: value
        }
      }
      return
    }
    if (key === 'referralRefundCommission') {
      if (parseFloat(value + '') > parseFloat(this.settings.publisherCommission + '')) {
        this.referralRefundMessage = 'Referral refund should not be greater than a publisher commission';
      } else {
        this.referralRefundMessage = null;
      }
    }
    this.settings = {
      ...this.settings,
      [key]: Number(value)
    };
  }

  saveSettings(): void {
    if (this.settings.hotwalletMinValue > this.settings.hotwalletMaxValue) {
      this.store.dispatch(new ShowDialogOnError(
        'Maximal threshold value cannot be smaller than a minimal.'
      ));
      return;
    }
    this.store.dispatch(new SetAdminSettings(this.settings));
    this.canSubmit = false;
  }
}
