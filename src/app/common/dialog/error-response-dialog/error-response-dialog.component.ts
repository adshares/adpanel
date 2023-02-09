import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-response-dialog',
  templateUrl: './error-response-dialog.component.html',
})
export class ErrorResponseDialogComponent implements OnInit {
  title = 'Request Failed';
  message = 'We have encountered an unknown error. Please try again.';

  constructor(
    public dialogRef: MatDialogRef<ErrorResponseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.message = this.data && this.data.message ? this.data.message : this.message;
    this.title = this.data && this.data.title ? this.data.title : this.title;
  }
}
