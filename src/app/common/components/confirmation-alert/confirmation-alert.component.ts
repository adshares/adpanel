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
    this.authService.getUserData()
    .first()
    .subscribe((user) => {
      console.log(this.isEmailConfirmed)
      this.isEmailConfirmed = user.isEmailConfirmed;
      const savedUser = localStorage.getItem('adshUser');
      if (user.isEmailConfirmed && savedUser) {
        const dataToSave = Object.assign({}, JSON.parse(savedUser), { isEmailConfirmed: true });
        this.user = dataToSave;
        this.store.dispatch(new authActions.SetUser(user));
        localStorage.setItem('adshUser', JSON.stringify(dataToSave));
      }
    });
  }

  resendActivationEmail() {
      const savedUser = localStorage.getItem('adshUser');
    this.authService.emailActivation(JSON.parse(savedUser).user.uuid).subscribe();
  }
}
