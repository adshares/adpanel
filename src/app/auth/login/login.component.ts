import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import 'rxjs/add/operator/map';

import * as AuthAction from '../../store/auth/auth.action';
import { AuthService } from '../auth.service';
import { UserModel } from '../../models/user.model';
import { CustomizeAccountChooseDialogComponent } from '../../common/dialog/customize-account-choose-dialog/customize-account-choose-dialog.component';
import { AccountChooseDialogComponent } from '../../common/dialog/account-choose-dialog/account-choose-dialog.component';
import { WalletDialogComponent } from '../../settings/dialogs/wallet-dialog/wallet-dialog.component';
import { HandleSubscription } from '../../common/handle-subscription';
import { AppState } from '../../models/app-state.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends HandleSubscription {
  @ViewChild('loginForm') loginForm: NgForm;
  @ViewChild('rememberUser') rememberUser: ElementRef;

  isLoggingIn = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private store: Store<AppState>
  ) {
    super(null);
    console.log(this.isLoggingIn)
  }

  login() {
    if (!this.loginForm.valid) {
      return;
    }

    this.isLoggingIn = true;
    console.log(this.isLoggingIn)

    const loginSubscription = this.authService.loginUser(
      this.loginForm.value.email,
      this.loginForm.value.password
     )
      .subscribe((userResponse: UserModel) => {
        this.store.dispatch(new AuthAction.LoginUser(userResponse));

        this.showStartupPopups(userResponse);

        if (userResponse.isAdvertiser) {
          this.router.navigate(['/advertiser/dashboard']);
        } else {
          this.router.navigate(['/publisher']);
        }
      });
    this.subscriptions.push(loginSubscription);
  }

  showStartupPopups(user: UserModel) {
    const firstLogin = this.route.snapshot.queryParams['customize'];

    if (firstLogin) {
      const dialogRef = this.dialog.open(CustomizeAccountChooseDialogComponent);

      const dialogSubscription = dialogRef.afterClosed()
        .subscribe((accounts) => this.handleCustomizeDialog(accounts));
      this.subscriptions.push(dialogSubscription);

    } else if (user.isAdvertiser && user.isPublisher) {
      this.dialog.open(AccountChooseDialogComponent);
    }
  }

  handleCustomizeDialog(accounts) {
    if (!accounts) {
      return;
    }

    if (!accounts.advertiser.selected && accounts.publisher.selected) {
      this.router.navigate(['/publisher']);
    }

    this.dialog.open(WalletDialogComponent);
  }
}
