import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-response-dialog',
  templateUrl: './confirm-response-dialog.component.html',
  styleUrls: ['./confirm-response-dialog.component.scss'],
})
export class ConfirmResponseDialogComponent {
  title = 'Request Success';
  message = 'We have executed action successfully as requested';

  constructor(
    public dialogRef: MatDialogRef<ConfirmResponseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.message =
      this.data && this.data.message ? this.data.message : this.message;
    this.title = this.data && this.data.title ? this.data.title : this.title;
  }
}
