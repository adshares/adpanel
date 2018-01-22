import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HandleSubscription } from '../../../common/handle-subscription';
import { Store } from '@ngrx/store';
import { AppState } from '../../../models/app-state.model';

@Component({
  selector: 'app-set-your-earnings-dialog',
  templateUrl: './set-your-earnings-dialog.component.html',
  styleUrls: ['./set-your-earnings-dialog.component.scss']
})
export class SetYourEarningsDialogComponent extends HandleSubscription {
  autoTicks = false;
  disabled = false;
  invert = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 0.01;
  thumbLabel = true;
  value = 0;
  vertical = false;

  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }
  set tickInterval(v) {
    this._tickInterval = Number(v);
  }
  private _tickInterval = 1;

  constructor(
    public dialogRef: MatDialogRef<SetYourEarningsDialogComponent>,
    private store: Store<AppState>
  ) {
    super(null);

    const adminSettingsSubscription = store.select('state', 'admin', 'settings')
      .subscribe(settings => {
        this.value = settings.earnings * 100;
      });

    this.subscriptions.push(adminSettingsSubscription);
  }
}
