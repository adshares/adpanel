import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

import { SessionService } from 'app/session.service';

@Component({
  selector: 'app-account-choose-dialog',
  templateUrl: './account-choose-dialog.component.html',
  styleUrls: ['./account-choose-dialog.component.scss'],
})
export class AccountChooseDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AccountChooseDialogComponent>,
    private router: Router,
    private session: SessionService
  ) {}

  redirectToPublisher() {
    this.session.setAccountTypeChoice(SessionService.ACCOUNT_TYPE_PUBLISHER);
    this.router.navigate(['/publisher/dashboard']);
    this.dialogRef.close();
  }

  redirectToAdvertiser() {
    this.session.setAccountTypeChoice(SessionService.ACCOUNT_TYPE_ADVERTISER);
    this.router.navigate(['/advertiser/dashboard']);
    this.dialogRef.close();
  }
}
