import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * Dialog of confirmation. If user accepts, `true` is returned.
 * Otherwise `false` or undefined value is returned.
 *
 * ```
 * const dialogRef = this.dialog.open(UserConfirmResponseDialogComponent, {
 *   data: {
 *     title: 'custom title',
 *     message: 'custom message',
 *   }
 * });
 * dialogRef.afterClosed().subscribe(result => {
 *   if(result) {
 *     // user accepted
 *   }
 * });
 * ```
 */
@Component({
  selector: 'app-user-confirm-response-dialog',
  templateUrl: './user-confirm-response-dialog.component.html',
  styleUrls: ['./user-confirm-response-dialog.component.scss'],
})
export class UserConfirmResponseDialogComponent implements OnInit {
  title = 'Confirm';
  message = 'Do You confirm?';

  constructor(
    public dialogRef: MatDialogRef<UserConfirmResponseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.message = this.data && this.data.message ? this.data.message : this.message;
    this.title = this.data && this.data.title ? this.data.title : this.title;
  }
}
