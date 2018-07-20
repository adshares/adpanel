import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/first';

import { AuthService } from 'auth/auth.service';
import { AppState } from 'models/app-state.model';
import * as authActions from 'store/auth/auth.actions';
import {User} from "models/user.model";

import { MatDialog } from '@angular/material/dialog';

import { EmailActivationResendConfirmDialogComponent } from "common/dialog/email-activation-resend-confirm-dialog/email-activation-resend-confirm-dialog.component";
import { EmailActivationResendFailedConfirmDialogComponent } from "common/dialog/email-activation-resend-failed-confirm-dialog/email-activation-resend-failed-confirm-dialog.component";

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
    private dialog: MatDialog
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
    this.authService.emailActivationResend("/auth/email-activate/").subscribe(()=>this.dialog.open(EmailActivationResendConfirmDialogComponent),()=>this.dialog.open(EmailActivationResendFailedConfirmDialogComponent));
  }
}
