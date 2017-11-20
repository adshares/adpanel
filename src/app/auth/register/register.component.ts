import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  @ViewChild('registrationForm') registrationForm: NgForm;


  constructor(private authService: AuthService, private router: Router) {}

  register() {
    const password = this.registrationForm.value.password
    const confirmPassword = this.registrationForm.value.confirmPassword

    if (!this.registrationForm.valid || password !== confirmPassword) {
      return;
    }

    this.authService.registerUser(this.registrationForm.value.email, this.registrationForm.value.password)
      .subscribe(
        () => {
          this.router.navigate(['/auth/confirmation']);
        }
      );
  }

}
