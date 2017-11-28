import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-account-choose-dialog',
  templateUrl: './account-choose-dialog.component.html',
  styleUrls: ['./account-choose-dialog.component.scss'],
})
export class AccountChooseDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<AccountChooseDialogComponent>,
    private router: Router
  ) { }

  redirectToPublisher() {
    this.router.navigate(['/publisher']);
    this.dialogRef.close();
  }
}
