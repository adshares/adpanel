import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/take';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-remind-password',
  templateUrl: './remind-password.component.html',
  styleUrls: ['./remind-password.component.scss'],
})
export class RemindPasswordComponent {
  @ViewChild('remindPasswordForm') remindPasswordForm: NgForm;

  isSendingEmail = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  sendRemindPasswordEmail() {
    const formValues = this.remindPasswordForm.value;

    if (!this.remindPasswordForm.valid || formValues.email !== formValues.emailConfirm) {
      return;
    }

    this.isSendingEmail = true;

    this.authService.remindPassword(formValues.email)
      .take(1)
      .subscribe(
        () => this.router.navigate(['/auth', 'login']),
        () => { },
        () => this.isSendingEmail = false
      );
  }
}
