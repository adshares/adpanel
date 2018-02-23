import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/first';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-remind-password',
  templateUrl: './remind-password.component.html',
  styleUrls: ['./remind-password.component.scss'],
})
export class RemindPasswordComponent {
  remindPasswordForm: FormGroup;

  isSendingEmail = false;
  remindPasswordFormSubmitted = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.remindPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  sendRemindPasswordEmail() {
    this.remindPasswordFormSubmitted = true;

    if (!this.remindPasswordForm.valid) {
      return;
    }

    this.isSendingEmail = true;

    this.authService.remindPassword(this.remindPasswordForm.value.email)
      .first()
      .subscribe(
        () => this.router.navigate(['/auth', 'login']),
        () => { },
        () => this.isSendingEmail = false
      );
  }
}
