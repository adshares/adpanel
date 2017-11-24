import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AuthService } from '../auth.service';
import * as AuthActions from '../store/auth.actions';
import { UserModel } from '../../auth/store/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm: NgForm;
  @ViewChild('rememberUser') rememberUser: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<{auth: { UserModel }}>) { }

  login() {
    if (!this.loginForm.valid) {
      return;
    }

    this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe(
        (userData) => {
          // console.log(userData._body);
          this.store.dispatch(new AuthActions.LoginUser(
            new UserModel(userData._body.email, userData._body.isAdvertiser, userData._body.isPublisher)
           ));
          this.router.navigate(['/advertiser']);
        }
      );
  }
}
