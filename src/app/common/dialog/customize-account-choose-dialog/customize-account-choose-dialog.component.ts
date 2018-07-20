import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from "auth/auth.service";
import { Router } from "@angular/router";
import { LocalStorageUser, User } from "models/user.model";

@Component({
  selector: 'app-customize-account-choose-dialog',
  templateUrl: './customize-account-choose-dialog.component.html',
  styleUrls: ['./customize-account-choose-dialog.component.scss']
})
export class CustomizeAccountChooseDialogComponent {
  accounts = {
    advertiser: { selected: false },
    publisher: { selected: false },
    isSelected: true
  };

  constructor(
    public dialogRef: MatDialogRef<CustomizeAccountChooseDialogComponent>,
    private auth: AuthService,
    private router: Router,
  ) { }

  checkAccountProperty(accounts) {
    if (accounts.advertiser.selected || accounts.publisher.selected) {
      const userData: LocalStorageUser = this.auth.getUserSession();
      const updates = <User>{
        isAdvertiser: accounts.advertiser.selected,
        isPublisher: accounts.publisher.selected
      };
      this.auth.saveUsers(userData.id, updates).subscribe(
        (userResponse: User) => {
          this.saveUserDataToLocalStorage(userResponse);
          this.redirectToDashboard(userResponse);
          this.dialogRef.close();
        }
      );
    } else {
      accounts.isSelected = false;
    }
  }

  redirectToDashboard(userResponse: User) {
    if (userResponse.isPublisher) {
      this.auth.storeAccountTypeChoice('publisher');
      this.router.navigate(['/publisher/dashboard']);
      return;
    }
    this.auth.storeAccountTypeChoice('advertiser');
    this.router.navigate(['/advertiser/dashboard']);
  }

  saveUserDataToLocalStorage(userResponse: User) {
    let userData: LocalStorageUser = this.auth.getUserSession();
    userData.isAdvertiser = userResponse.isAdvertiser ? true : false;
    userData.isPublisher = userResponse.isPublisher ? true : false;
    this.auth.storeUserSession(userData);
  }
}
