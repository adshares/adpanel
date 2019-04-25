import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import { HandleSubscription } from 'common/handle-subscription';
import { SetAdminSettings, SetAdminSettingsFailure } from "store/admin/admin.actions";
import { AdminSettings } from "models/settings.model";
import { environment } from "environments/environment";

@Component({
  selector: 'app-finances-settings',
  templateUrl: './finances-settings.component.html',
  styleUrls: ['./finances-settings.component.scss'],
  host: {'class': 'app-finances'},
})
export class FinancesSettingsComponent extends HandleSubscription implements OnInit {
  cryptoCode:string = environment.cryptoCode;
  settings: AdminSettings;
  canSubmit: boolean = false;

  constructor(private store: Store<AppState>) {
    super();
  }

  ngOnInit() {
    const adminStoreSettingsSubscription = this.store.select('state', 'admin', 'settings')
      .subscribe((settings: AdminSettings) => {
        this.settings = settings;
      });

    this.subscriptions.push(adminStoreSettingsSubscription);
  }

  updateSettings(value: number | boolean | string, key: string): void {
    if (`${value}`.length === 0) {
      this.canSubmit = false;
      return;
    }
    this.canSubmit = true;
    if (key === 'coldWalletAddress') {
      this.settings = {
        ...this.settings,
        [key]: value
      };
      return
    }
    this.settings = {
      ...this.settings,
      [key]: Number(value)
    };
  }

  saveSettings(): void {
    if (this.settings.hotwalletMinValue > this.settings.hotwalletMaxValue) {
      this.store.dispatch(new SetAdminSettingsFailure(
        'Maximal threshold value cannot be smaller than a minimal.'
      ));
      return;
    }
    this.store.dispatch(new SetAdminSettings(this.settings));
    this.canSubmit = false;
  }
}
