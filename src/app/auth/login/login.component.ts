import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
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
  criteriaError= false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit() {
    this.createForm();
    this.checkIfUserRemembered();
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

    const loginSubscription = this.authService.loginUser(
      this.loginForm.value.email,
      this.loginForm.value.password
    )
      .subscribe((userResponse: User) => {
        this.store.dispatch(new authActions.SetUser(userResponse));
        this.saveUserDataToLocalStorage(userResponse);
        if (userResponse.isAdmin) {
          this.store.dispatch(new commonActions.SetActiveUserType(userRolesEnum.ADMIN));
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.showStartupPopups(userResponse);

          if (userResponse.isAdvertiser) {
            this.store.dispatch(new commonActions.SetActiveUserType(userRolesEnum.ADVERTISER));
            this.router.navigate(['/advertiser/dashboard']);
          } else if (userResponse.isPublisher) {
            this.store.dispatch(new commonActions.SetActiveUserType(userRolesEnum.PUBLISHER));
            this.router.navigate(['/publisher/dashboard']);
          }
        }

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
    localStorage.setItem('adshUser', JSON.stringify(dataToSave));

  }

  showStartupPopups(user: User) {
    const firstLogin = this.route.snapshot.queryParams['customize'];
    if (firstLogin) {
      const dialogRef = this.dialog.open(CustomizeAccountChooseDialogComponent, { disableClose: true });

      dialogRef.afterClosed()
        .subscribe((accounts) => this.handleCustomizeDialog(accounts));

    } else if (user.isAdvertiser && user.isPublisher) {
      this.dialog.open(AccountChooseDialogComponent);
    }
  }

  handleCustomizeDialog(accounts) {
    if (!accounts) {
      return;
    }

    if (!accounts.advertiser.selected && accounts.publisher.selected) {
      this.router.navigate(['/publisher/dashboard']);
    }

    this.dialog.open(WalletDialogComponent);
  }
}
