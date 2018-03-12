import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { HandleSubscription } from 'common/handle-subscription';
import { AppState } from 'models/app-state.model';
import { AdminSettings } from 'models/settings.model';

@Component({
  selector: 'app-set-your-earnings-dialog',
  templateUrl: './set-your-earnings-dialog.component.html',
  styleUrls: ['./set-your-earnings-dialog.component.scss']
})
export class SetYourEarningsDialogComponent extends HandleSubscription {
  value = 0;

  constructor(
    public dialogRef: MatDialogRef<SetYourEarningsDialogComponent>,
    private store: Store<AppState>
  ) {
    super(null);

    const adminSettingsSubscription = store.select('state', 'admin', 'settings')
      .subscribe((settings: AdminSettings) => {
        this.value = settings.earnings * 100;
      });

    this.subscriptions.push(adminSettingsSubscription);
  }
}
