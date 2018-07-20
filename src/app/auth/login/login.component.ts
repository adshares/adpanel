import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import 'rxjs/add/operator/map';

import * as authActions from 'store/auth/auth.actions';
import * as commonActions from 'store/common/common.actions';

import { AuthService } from 'auth/auth.service';
import { User, LocalStorageUser } from 'models/user.model';
import { CustomizeAccountChooseDialogComponent } from 'common/dialog/customize-account-choose-dialog/customize-account-choose-dialog.component';
import { AccountChooseDialogComponent } from 'common/dialog/account-choose-dialog/account-choose-dialog.component';
import { WalletDialogComponent } from 'settings/dialogs/wallet-dialog/wallet-dialog.component';
import { HandleSubscription } from 'common/handle-subscription';
import { AppState } from 'models/app-state.model';
import { appSettings } from 'app-settings';
import { userRolesEnum } from 'models/enum/user.enum';
import { isUnixTimePastNow } from 'common/utilities/helpers';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends HandleSubscription implements OnInit {
  @ViewChild('rememberUser') rememberUser: ElementRef;

  loginForm: FormGroup;

  isLoggingIn = false;
  loginFormSubmitted = false;
  criteriaError = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit() {

    const userData: LocalStorageUser = this.auth.getUserSession();
    if (userData) {
        this.handleActiveSession(userData);
        return;
    }

    this.createForm();
    this.checkIfUserRemembered();
  }

  handleActiveSession(userData: LocalStorageUser) {
    if (isUnixTimePastNow(userData.expiration)) {
      this.auth.logOut().subscribe(
        () => {
          this.auth.dropUserSession();
          this.router.navigate(['/auth', 'login']);
        },
        () => {
          this.auth.dropUserSession();
          this.router.navigate(['/auth', 'login']);
        }
      );
      return;
    }

    this.router.navigate(['/' + this.auth.getAccountTypeChoice(), 'dashboard']);
  }

  createForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  checkIfUserRemembered() {
    const userData = JSON.parse(localStorage.getItem('adshUser'));

    if (userData && userData.remember && !isUnixTimePastNow(userData.expiration)) {
      this.loginForm.get('email').setValue(userData.email);
      this.loginForm.get('password').setValue('*'.repeat(parseInt(userData.passwordLength)));
      this.rememberUser.nativeElement.checked = true;
    }
  }

  login() {
    this.loginFormSubmitted = true;

    if (!this.loginForm.valid) {
      return;
    }

    this.isLoggingIn = true;

    const loginSubscription = this.auth.loginUser(
      this.loginForm.value.email,
      this.loginForm.value.password
    )
      .subscribe((userResponse: User) => {
        this.saveUserDataToLocalStorage(userResponse);
        if (userResponse.isAdmin) {
          this.router.navigate(['/admin/dashboard']);
          return;
        }
        this.showStartupPopups(userResponse);
      },
        (err) => {
          this.criteriaError = true;
          this.isLoggingIn = false;
        });
    this.subscriptions.push(loginSubscription);
  }

  saveUserDataToLocalStorage(userResponse: User) {
    const rememberUser = this.rememberUser.nativeElement.checked;
    const expirationSeconds = rememberUser ?
      appSettings.REMEMBER_USER_EXPIRATION_SECONDS : appSettings.AUTH_TOKEN_EXPIRATION_SECONDS;
    const dataToSave: LocalStorageUser = Object.assign({}, userResponse, {
      remember: rememberUser,
      passwordLength: this.loginForm.get('password').value.length,
      expiration: ((+new Date) / 1000 | 0) + expirationSeconds
    });
    this.auth.storeUserSession(dataToSave);
  }

  showStartupPopups(user: User) {

    if (user.isAdvertiser && user.isPublisher) {
      const chooseAccount = this.auth.getAccountTypeChoice();
      if (!chooseAccount) {
        this.dialog.open(AccountChooseDialogComponent, { disableClose: true });
        return;
      }
      if (chooseAccount == "advertiser") {
        this.router.navigate(['/advertiser/dashboard']);
        return;
      }
      if (chooseAccount == "publisher") {
        this.router.navigate(['/publisher/dashboard']);
        return;
      }
    }
    if (user.isAdvertiser) {
      this.auth.storeAccountTypeChoice('advertiser');
      this.router.navigate(['/advertiser/dashboard']);
      return;
    }
    if (user.isPublisher) {
      this.auth.storeAccountTypeChoice('publisher');
      this.router.navigate(['/publisher/dashboard']);
      return;
    }
    this.dialog.open(CustomizeAccountChooseDialogComponent, { disableClose: true });
  }

  handleCustomizeDialog(accounts) {
    // TODO : this does something? review fix display
    this.dialog.open(WalletDialogComponent);
  }
}
