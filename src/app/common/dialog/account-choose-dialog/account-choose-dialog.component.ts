import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../models/app-state.model';

import { MatDialogRef } from '@angular/material/dialog';
import * as commonActions from '../../../store/common/common.actions';

@Component({
  selector: 'app-account-choose-dialog',
  templateUrl: './account-choose-dialog.component.html',
  styleUrls: ['./account-choose-dialog.component.scss'],
})
export class AccountChooseDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<AccountChooseDialogComponent>,
    private router: Router,
    private store: Store<AppState>
  ) { }

  redirectToPublisher() {
    this.store.dispatch(new commonActions.SetActiveUserType('publisher'));
    this.router.navigate(['/publisher/dashboard']);
    this.dialogRef.close();
  }
}
