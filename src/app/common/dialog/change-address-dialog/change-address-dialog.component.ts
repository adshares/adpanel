import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-change-address-dialog',
  templateUrl: './change-address-dialog.component.html',
  styleUrls: ['./change-address-dialog.component.scss']
})
export class ChangeAddressDialogComponent {

  constructor(public dialogRef: MatDialogRef<ChangeAddressDialogComponent>) { }

}
