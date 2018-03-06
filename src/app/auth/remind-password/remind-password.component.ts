import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-remind-password',
  templateUrl: './remind-password.component.html',
  styleUrls: ['./remind-password.component.scss'],
})
export class RemindPasswordComponent {
  @ViewChild('remindPasswordForm') remindPasswordForm: NgForm;

  isSendingEmail = false;
  emailDontExist = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  sendRemindPasswordEmail() {
    const formValues = this.remindPasswordForm.value;

    if (!this.remindPasswordForm.valid) {
      return;
    }

    this.isSendingEmail = true;
    this.emailDontExist = false;

    this.authService.remindPassword(formValues.email)
      .subscribe(
        () => this.router.navigate(['/auth', 'login']),
        (err) => {
          if (err.code === 412) {
            this.emailDontExist = true;
          }
        },
        () => this.isSendingEmail = false
      );
  }
}
