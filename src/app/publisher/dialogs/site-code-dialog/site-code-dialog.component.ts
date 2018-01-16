import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-site-code-dialog',
  templateUrl: './site-code-dialog.component.html',
  styleUrls: ['./site-code-dialog.component.scss']
})
export class SiteCodeDialogComponent {
  constructor(public dialogRef: MatDialogRef<SiteCodeDialogComponent>) {}
}
