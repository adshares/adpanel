import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { HandleSubscription } from '../../../common/handle-subscription';
import { AppState } from '../../../models/app-state.model';
import { AdminSettings } from '../../../models/settings.model';
import { AdminService } from '../../admin.service';
import * as adminActions from '../../../store/admin/admin.actions';

@Component({
  selector: 'app-set-your-earnings-dialog',
  templateUrl: './set-your-earnings-dialog.component.html',
  styleUrls: ['./set-your-earnings-dialog.component.scss']
})
export class SetYourEarningsDialogComponent extends HandleSubscription implements OnInit {
  value: number;
  valueChanged: Subject<number> = new Subject<number>();

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

    const addminSettingsChangeSubscription = this.valueChanged
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((newValue) => {
        this.adminService.setAdminSettings({ earnings: newValue })
          .subscribe((newSettings) => this.store.dispatch(new adminActions.SetAdminSettings(newSettings)));
       });
    this.subscriptions.push(addminSettingsChangeSubscription);
  }

  updateValue(newValue) {
    this.valueChanged.next(newValue);
  }
}
