import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-information-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.scss'],
})
export class InformationDialogComponent {
  title;
  message;
  link;
  href;
  secret;

  constructor(
    public dialogRef: MatDialogRef<InformationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit() {
    this.message = (this.data && this.data.message) ? this.data.message : '';
    this.title = (this.data && this.data.title) ? this.data.title : '';
    this.link = (this.data && this.data.link) ? this.data.link: '';
    this.href = (this.data && this.data.href) ? this.data.href: '';
    this.secret = (this.data && this.data.secret) ? this.data.secret : '';
  }
}
