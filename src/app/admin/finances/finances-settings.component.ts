import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import { HandleSubscription } from 'common/handle-subscription';
import { fadeAnimation } from "common/animations/fade.animation";
import { SetAdminSettings, SetAdminSettingsFailure } from "store/admin/admin.actions";
import { AdminSettings } from "models/settings.model";

@Component({
  selector: 'app-finances-settings',
  templateUrl: './finances-settings.component.html',
  styleUrls: ['./finances-settings.component.scss'],
  host: {'class': 'app-finances'},
  animations: [fadeAnimation]
})
export class FinancesSettingsComponent extends HandleSubscription implements OnInit {
  settings:AdminSettings;
  constructor(
    private store: Store<AppState>,
  ) {
    super();
  }

  ngOnInit() {
    const adminStoreSettingsSubscription = this.store.select('state', 'admin', 'settings')
      .subscribe((settings: AdminSettings) => {
        this.settings = settings;
      });

    this.subscriptions.push(adminStoreSettingsSubscription);
  }

  updateSettings(value: number, key: string): void {
    this.settings = {
      ...this.settings,
      [key]: value
    };
  }

  saveSettings():void {
    if (this.settings.hotwalletMinValue > this.settings.hotwalletMaxValue) {
      this.store.dispatch(new SetAdminSettingsFailure(
        'Maximal threshold value cannot be smaller than a minimal.'
      ));
      return;
    }
    this.store.dispatch(new SetAdminSettings(this.settings))
  }
}
