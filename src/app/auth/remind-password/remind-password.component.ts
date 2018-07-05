import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'auth/auth.service';
import { appSettings } from 'app-settings';

@Component({
  selector: 'app-remind-password',
  templateUrl: './remind-password.component.html',
  styleUrls: ['./remind-password.component.scss'],
})
export class RemindPasswordComponent {
  @ViewChild('remindPasswordForm') remindPasswordForm: NgForm;

  isSendingEmail = false;
  emailDoesntExist = false;
  supportEmail = appSettings.SUPPORT_EMAIL;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  sendRemindPasswordEmail() {
    const formValues = this.remindPasswordForm.value;
    const uri = "/auth/confirm-password/";
    if (!this.remindPasswordForm.valid) {
      return;
      return;
    }

    this.isSendingEmail = true;
    this.emailDoesntExist = false;

    this.authService.remindPassword(formValues.email, uri)
      .subscribe(
        () => this.router.navigate(['/auth', 'confirmation-password-send']),
        (err) => {
          this.isSendingEmail = false;
          if (err.code === 412) {
            this.emailDoesntExist = true;
          }
        },
        () => this.isSendingEmail = false
      );
  }
}
