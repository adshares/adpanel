import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {AuthService} from "auth/auth.service";
import {Router} from "@angular/router";
import {LocalStorageUser, User} from "models/user.model";

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

  constructor(
    public dialogRef: MatDialogRef<CustomizeAccountChooseDialogComponent>,
    private authService: AuthService,
    private router: Router,
  ) { }

  checkAccountProperty(accounts) {
    if (accounts.advertiser.selected || accounts.publisher.selected) {
      const userData: LocalStorageUser = JSON.parse(localStorage.getItem('adshUser'));
      const user = <User> {
        isAdvertiser: accounts.advertiser.selected,
        isPublisher: accounts.publisher.selected
      };
      this.authService.saveUsers(userData.id ,user) .subscribe(
        (userResponse: User) => {
          this.saveUserDataToLocalStorage(userResponse);
          this.dialogRef.close();
          if (userResponse.isPublisher) {
              this.router.navigate(['/publisher/dashboard']);
              // TODO; fix this hack
              location.reload();
              return;
          }
          this.router.navigate(['/advertiser/dashboard']);
          // TODO; fix this hack
          location.reload();
          return;
        }
      );
    } else {
      accounts.isSelected = false;
    }
  }

  saveUserDataToLocalStorage(userResponse: User) {
    const userData: LocalStorageUser = JSON.parse(localStorage.getItem('adshUser'));
    userData.isAdvertiser = userResponse.isAdvertiser ? true : false;
    userData.isPublisher = userResponse.isPublisher ? true : false;
    localStorage.setItem('adshUser', JSON.stringify(userData));
  }
}
