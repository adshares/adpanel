import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @ViewChild('registrationForm') registrationForm: NgForm;
  formSubmitted = false;
  @ViewChild('email') email: string = '';
  @ViewChild('password') password: string = '';
  @ViewChild('confirmPassword') confirmPassword: string = '';


  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    console.log(this.email, this.password, this.confirmPassword);
  }

  register() {
    this.formSubmitted = true;

    if (!this.registrationForm.valid) {
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
