import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { SettingsService } from 'settings/settings.service';
import { HandleSubscription } from 'common/handle-subscription';
import { ActivatedRoute } from "@angular/router";
import {LocalStorageUser} from "models/user.model";

interface AfterRequestValidation {
  email: { [key: string]: boolean };
  password: { [key: string]: boolean };
}

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent extends HandleSubscription implements OnInit {
  changeEmailForm: FormGroup;
  changeEmailFormSubmitted = false;
  changePasswordForm: FormGroup;
  changePasswordFormSubmitted = false;

  newPasswordConfirm = new FormControl();
  afterRequestValidation: AfterRequestValidation = {
    email: {
      success: false,
      emailChangeFailed: false
    },
    password: {
      success: false,
      wrongPreviousPassword: false,
      passwordChangeFailed: false
    }
  };
  errorsPasswordChange= {};

  ObjectKeys = Object.keys;
  graceTime= null;
  constructor(
    private settingsService: SettingsService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
     this.createForms();
     this.graceTime = true;
  }

  createForms() {
    this.changeEmailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });

    this.changePasswordForm = new FormGroup({
      currentPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  onChangeEmail() {
    const newEmail = this.changeEmailForm.get('email').value;

    this.changeEmailFormSubmitted = true;
    Object.keys(this.afterRequestValidation.email).forEach(
      (validation) => this.afterRequestValidation.email[validation] = false
    );

    if (!this.changeEmailForm.valid) {
      return;
    }
    const userData: LocalStorageUser = JSON.parse(localStorage.getItem('adshUser'));
    const email = newEmail;
    const changeEmailSubscription = this.settingsService.changeEmail(
        email,
        "/auth/confirm-old-change-email/",
        "/auth/confirm-new-change-email/"
    )
      .subscribe(
        () => {
          this.changeEmailForm.get('email').setValue('');
          this.afterRequestValidation.email.success = true;
        },
        () => this.afterRequestValidation.email.emailChangeFailed = true,
        () => this.changeEmailFormSubmitted = false
      );
    this.subscriptions.push(changeEmailSubscription);
  }

  onChangePassword() {
    const currentPassword = this.changePasswordForm.get('currentPassword').value;
    const newPassword = this.changePasswordForm.get('newPassword').value;

    this.changePasswordFormSubmitted = true;
    Object.keys(this.afterRequestValidation.password).forEach(
      (validation) => this.afterRequestValidation.password[validation] = false
    );

    if (!this.changePasswordForm.valid || (this.newPasswordConfirm.value !== newPassword)) {
      return;
    }
    const userData: LocalStorageUser = JSON.parse(localStorage.getItem('adshUser'));
    const user = {
      password_old: currentPassword,
      password_new: newPassword
    };
    const changePasswordSubscription = this.settingsService.changePassword(user,
      "/"
    )
      .subscribe(
        () => {
          this.changePasswordForm.reset();
          this.newPasswordConfirm.setValue('');
          this.afterRequestValidation.password.success = true;
        },
        (err) => {
          if (err.code === 412) {
            this.afterRequestValidation.password.wrongPreviousPassword = true;
          } else {
            this.afterRequestValidation.password.passwordChangeFailed = true;
          }
          this.errorsPasswordChange = err.error.errors;
        },
        () => this.changePasswordFormSubmitted = false
      );
    this.subscriptions.push(changePasswordSubscription);
  }
}
