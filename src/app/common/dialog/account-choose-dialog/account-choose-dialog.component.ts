import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material/dialog';

import { SessionService } from "app/session.service";
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
    private session: SessionService,
  ) { }

  redirectToPublisher() {
    this.session.setAccountTypeChoice('publisher');
    this.router.navigate(['/publisher/dashboard']);
    this.dialogRef.close();
  }
  redirectToAdvertiser() {
    this.session.setAccountTypeChoice('advertiser');
    this.router.navigate(['/advertiser/dashboard']);
    this.dialogRef.close();
  }
}
