import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import { HandleSubscription } from 'common/handle-subscription';
import { fadeAnimation } from "common/animations/fade.animation";
import { Subject } from "rxjs";
import { AdminSettings } from "models/settings.model";
import { SetAdminSettings } from "store/admin/admin.actions";

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.scss'],
  animations: [fadeAnimation]
})
export class EarningsComponent extends HandleSubscription implements OnInit {
  value: number;
  valueChanged = new Subject<number>();

  constructor(
    private store: Store<AppState>,
  ) {
    super();
  }

  ngOnInit() {
    const adminStoreSettingsSubscription = this.store.select('state', 'admin', 'settings')
      .first()
      .subscribe((settings: AdminSettings) => {
        this.value = settings.earnings * 100;
      });
    this.subscriptions.push(adminStoreSettingsSubscription);
  }

  updateValue(newValue: number): void {
    this.value = newValue;
    this.valueChanged.next(newValue);
  }

  saveSettings(): void {
    this.store.dispatch(new SetAdminSettings({earnings: this.value}))
  }
}
