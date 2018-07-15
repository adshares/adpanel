import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/first';

import { AuthService } from 'auth/auth.service';
import { AppState } from 'models/app-state.model';
import * as authActions from 'store/auth/auth.actions';
import {User} from "models/user.model";

@Component({
  selector: 'app-confirmation-alert',
  templateUrl: './confirmation-alert.component.html',
  styleUrls: ['./confirmation-alert.component.scss'],
})
export class ConfirmationAlertComponent implements OnInit {
  user: User;
  isEmailConfirmed;
  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    const savedUser = localStorage.getItem('adshUser');
    if(savedUser){
        this.isEmailConfirmed = JSON.parse(savedUser).isEmailConfirmed;
    }
    this.authService.getUserData()
    .first()
    .subscribe((user) => {
      this.isEmailConfirmed = user.isEmailConfirmed;

      if (user.isEmailConfirmed && savedUser) {
        const dataToSave = Object.assign({}, JSON.parse(savedUser), { isEmailConfirmed: true });
        localStorage.setItem('adshUser', JSON.stringify(dataToSave));
        this.user = dataToSave;
        this.store.dispatch(new authActions.SetUser(user));
      }
    });
  }

  resendActivationEmail() {
    const savedUser = localStorage.getItem('adshUser');
    this.authService.emailActivationResend("/register-confirm/").subscribe();
  }
}
