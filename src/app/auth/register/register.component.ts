import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../auth.service'
import { CustomizeAccountChooseDialogComponent } from '../../common/dialog/customize-account-choose-dialog/customize-account-choose-dialog.component'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  @ViewChild('registrationForm') registrationForm: NgForm;
  formSubmitted = false;


  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  register() {
    this.formSubmitted = true;
    const password = this.registrationForm.value.password
    const confirmPassword = this.registrationForm.value.confirmPassword

    if (!this.registrationForm.valid || password !== confirmPassword) {
      return;
    }

    this.authService.registerUser(this.registrationForm.value.email, this.registrationForm.value.password)
      .subscribe(
        () => {
          this.dialog.open(CustomizeAccountChooseDialogComponent);
          this.router.navigate(['/auth/confirmation']);
        }
      );
  }

}
