import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import { HandleSubscription } from 'common/handle-subscription';
import { fadeAnimation } from "common/animations/fade.animation";
import { AdminSettings } from "models/settings.model";
import { SetAdminSettings } from "store/admin/admin.actions";

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'],
  host: {'class': 'app-finances'},
  animations: [fadeAnimation]
})
export class GeneralSettingsComponent extends HandleSubscription implements OnInit {
  settings: AdminSettings;
  canSubmit: boolean = false;

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
    this.canSubmit = true;
  }

  saveSettings(): void {
    this.store.dispatch(new SetAdminSettings(this.settings))
    this.canSubmit = false;
  }
}
