import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {userRolesEnum} from "models/enum/user.enum";
import * as commonActions from "store/common/common.actions";

@Component({
  selector: 'app-customize-account-choose-dialog',
  templateUrl: './customize-account-choose-dialog.component.html',
  styleUrls: ['./customize-account-choose-dialog.component.scss']
})
export class CustomizeAccountChooseDialogComponent {
  accounts = {
    advertiser: { selected: false },
    publisher: { selected: false },
    isSelected : true
  };
  checkAccountProperty(accounts) {
    if (accounts.advertiser.selected || accounts.publisher.selected) {
      this.dialogRef.close();
    } else {
      accounts.isSelected = false;
    }
  }
  constructor(public dialogRef: MatDialogRef<CustomizeAccountChooseDialogComponent>) { }
}
