import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { HandleSubscription } from 'common/handle-subscription';
import { AppState } from 'models/app-state.model';
import { AdminSettings } from 'models/settings.model';
import { AdminService } from 'admin/admin.service';
import * as adminActions from 'store/admin/admin.actions';

@Component({
  selector: 'app-set-your-earnings-dialog',
  templateUrl: './set-your-earnings-dialog.component.html',
  styleUrls: ['./set-your-earnings-dialog.component.scss']
})
export class SetYourEarningsDialogComponent extends HandleSubscription implements OnInit {
  value: number;
  valueChanged = new Subject<number>();

  constructor(
    public dialogRef: MatDialogRef<SetYourEarningsDialogComponent>,
    private store: Store<AppState>,
    private adminService: AdminService
  ) {
    super(null);
  }

  ngOnInit() {
    const adminStoreSettingsSubscription = this.store.select('state', 'admin', 'settings')
      .subscribe((settings: AdminSettings) => {
        this.value = settings.earnings * 100;
      });
    this.subscriptions.push(adminStoreSettingsSubscription);

    const adminSettingsChangeSubscription = this.valueChanged.pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
      .subscribe((newValue: number) => {
        this.adminService.setAdminSettings({ earnings: newValue })
          .subscribe((newSettings) => this.store.dispatch(new adminActions.SetAdminSettings(newSettings)));
       });
    this.subscriptions.push(adminSettingsChangeSubscription);
  }

  updateValue(newValue) {
    this.valueChanged.next(newValue);
  }
}
