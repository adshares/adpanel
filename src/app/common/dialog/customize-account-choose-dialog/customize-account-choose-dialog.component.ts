import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from "app/api/api.service";
import { Router } from "@angular/router";
import { LocalStorageUser, User } from "models/user.model";
import { SessionService } from "app/session.service";

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
    private api: ApiService,
    private session: SessionService,
    private router: Router,
  ) { }

  checkAccountProperty(accounts) {
    if (accounts.advertiser.selected || accounts.publisher.selected) {
      const userData: LocalStorageUser = this.session.getUser();
      const updates = <User>{
        isAdvertiser: accounts.advertiser.selected,
        isPublisher: accounts.publisher.selected
      };
      this.api.users.patch(userData.id, updates).subscribe(
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
      this.session.setAccountTypeChoice('publisher');
      this.router.navigate(['/publisher/dashboard']);
      return;
    }
    this.session.setAccountTypeChoice('advertiser');
    this.router.navigate(['/advertiser/dashboard']);
  }

  saveUserDataToLocalStorage(userResponse: User) {
    let userData: LocalStorageUser = this.session.getUser();
    userData.isAdvertiser = userResponse.isAdvertiser ? true : false;
    userData.isPublisher = userResponse.isPublisher ? true : false;
    this.session.setUser(userData);
  }
}
