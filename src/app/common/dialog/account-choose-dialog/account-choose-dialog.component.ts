import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material/dialog';

import { AppState } from 'models/app-state.model';
import { userRolesEnum } from 'models/enum/user.enum';
import * as commonActions from 'store/common/common.actions';

@Component({
  selector: 'app-account-choose-dialog',
  templateUrl: './account-choose-dialog.component.html',
  styleUrls: ['./account-choose-dialog.component.scss'],
})
export class AccountChooseDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AccountChooseDialogComponent>,
    private router: Router,
    private store: Store<AppState>
  ) { }

  redirectToPublisher() {
    this.store.dispatch(new commonActions.SetActiveUserType(userRolesEnum.PUBLISHER));
    this.router.navigate(['/publisher/dashboard']);
    this.dialogRef.close();
  }
}
