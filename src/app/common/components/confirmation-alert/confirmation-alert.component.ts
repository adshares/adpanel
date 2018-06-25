import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/first';

import { AuthService } from 'auth/auth.service';
import { AppState } from 'models/app-state.model';
import * as authActions from 'store/auth/auth.actions';

@Component({
  selector: 'app-confirmation-alert',
  templateUrl: './confirmation-alert.component.html',
  styleUrls: ['./confirmation-alert.component.scss'],
})
export class ConfirmationAlertComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.authService.getUserData()
    .first()
    .subscribe((user) => {
      const savedUser = localStorage.getItem('adshUser');

      if (user.isEmailConfirmed && savedUser) {
        const dataToSave = Object.assign({}, JSON.parse(savedUser), { user:{isEmailConfirmed: true }});

        this.store.dispatch(new authActions.SetUser(user));
        localStorage.setItem('adshUser', JSON.stringify(dataToSave));
      }
    });
  }

  resendActivationEmail() {
    this.authService.sendActivationEmail().subscribe();
  }
}
