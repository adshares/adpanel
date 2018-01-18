import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-site-code-dialog',
  templateUrl: './site-code-dialog.component.html',
  styleUrls: ['./site-code-dialog.component.scss']
})
export class SiteCodeDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SiteCodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    console.log(data)
    console.log(this.data)
  }

}
