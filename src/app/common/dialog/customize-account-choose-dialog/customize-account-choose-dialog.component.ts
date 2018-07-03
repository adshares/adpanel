import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {AuthService} from "auth/auth.service";
import {Router} from "@angular/router";
import {LocalStorageUser} from "models/user.model";

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
     const userData: LocalStorageUser = JSON.parse(localStorage.getItem('adshUser'))
      var user = { isAdvertiser: accounts.advertiser.selected, isPublisher: accounts.publisher.selected};
      this.authService.saveUsers(userData.uuid ,user) .subscribe(userData =>  this.dialogRef.close());

      this.router.navigate(['/publisher/dashboard']);
    } else {
      accounts.isSelected = false;
    }
  }
  constructor(
      public dialogRef: MatDialogRef<CustomizeAccountChooseDialogComponent>,
      private authService: AuthService,
      private router: Router,) { }
}
