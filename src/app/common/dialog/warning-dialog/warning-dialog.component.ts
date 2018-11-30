import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'warning-dialog',
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.scss'],
})
export class WarningDialogComponent {
  message: string = "";
  title: string = "";

  constructor(
    public dialogRef: MatDialogRef<WarningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit() {
    this.message = (this.data && this.data.message) ? this.data.message : this.message;
    this.title = (this.data && this.data.title) ? this.data.title : this.title;
  }
}
