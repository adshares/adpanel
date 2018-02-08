import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-customize-account-choose-dialog',
  templateUrl: './customize-account-choose-dialog.component.html',
  styleUrls: ['./customize-account-choose-dialog.component.scss']
})
export class CustomizeAccountChooseDialogComponent {
  accounts: object = {
    advertiser: { selected: false },
    publisher: { selected: false }
  };

  constructor(public dialogRef: MatDialogRef<CustomizeAccountChooseDialogComponent>) { }
}
