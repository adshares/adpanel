import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { SettingsService } from 'settings/settings.service';
import { HandleSubscription } from 'common/handle-subscription';

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

  constructor(
    private settingsService: SettingsService
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

    const changeEmailSubscription = this.settingsService.changeEmail(newEmail)
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

    const changePasswordSubscription = this.settingsService.changePassword(
      currentPassword,
      newPassword
    )
      .subscribe(
        () => {
          this.changePasswordForm.reset();
          this.newPasswordConfirm.setValue('');
          this.afterRequestValidation.password.success = true;
        },
        (err) => {
          console.log(err)
          if (err.code === 412) {
            this.afterRequestValidation.password.wrongPreviousPassword = true;
          } else {
            this.afterRequestValidation.password.passwordChangeFailed = true;
          }
          if (err.code === 411) {
            this.afterRequestValidation.password.lockTimePassword = true;
          }
          if (err.code === 410) {
              this.afterRequestValidation.password.maxReuse = true;
          }
          if (err.code === 409) {
              this.afterRequestValidation.password.maxReuseTime = true;
          }

        },
        () => this.changePasswordFormSubmitted = false
      );
    this.subscriptions.push(changePasswordSubscription);
  }

    checkNotifyPasswordGraceTime(userResponse){
        var diff = Math.abs(new Date().getTime() - new Date(userResponse.passwordLifeTime).getTime());
        var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        if(diffDays  <= userResponse.passwordGraceTime){
            return false;
        }
    }
}
