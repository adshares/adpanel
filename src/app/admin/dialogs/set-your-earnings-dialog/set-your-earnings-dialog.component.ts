import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { HandleSubscription } from 'common/handle-subscription';
import { AppState } from 'models/app-state.model';
import { AdminSettings } from 'models/settings.model';
import {SetAdminSettings} from 'store/admin/admin.actions';

@Component({
  selector: 'app-set-your-earnings-dialog',
  templateUrl: './set-your-earnings-dialog.component.html',
  styleUrls: ['./set-your-earnings-dialog.component.scss']
})

export class SetYourEarningsDialogComponent extends HandleSubscription implements OnInit {
  value: number;

  constructor(
    public dialogRef: MatDialogRef<SetYourEarningsDialogComponent>,
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

  updateValue(newValue) {
    this.value = newValue;
  }

  saveSettings(): void {
    this.dialogRef.close();
    this.store.dispatch(new SetAdminSettings({earnings: this.value}))
  }
}
