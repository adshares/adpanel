import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { EmailActivateConfirmDialogComponent } from "common/dialog/email-activate-confirm-dialog/email-activate-confirm-dialog.component";

@Component({
  selector: 'app-email-activate',
  templateUrl: './email-activate.component.html',
  styleUrls: ['./email-activate.component.scss'],
})

export class EmailActivateComponent {
  token: any;
  ObjectKeys = Object.keys;
  errorsRegister: {};
  errorCode: {}
  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    console.log('hello');
    this.route.params.subscribe(params => {
      this.token = params['token'];
      this.emailActivation(this.token);
    });
  }
  emailActivation(token) {
    this.auth.emailActivation(token)
      .subscribe(
        () => {
          const chooseAccount = this.auth.getAccountTypeChoice();
          const userData = this.auth.getUserSession();

          if (userData) {
            userData.isEmailConfirmed = true;
            this.auth.storeUserSession(userData);

            if (chooseAccount) {
              this.dialog.open(EmailActivateConfirmDialogComponent);
              this.router.navigate(['/' + chooseAccount, 'dashboard']);
              return;
            }
          }

          this.dialog.open(EmailActivateConfirmDialogComponent);
        },
        (err) => {
          // TODO: action for failed hash
          console.log(err);
          if (err.status == 403) {
            this.errorCode = { "error": true };
          }
        }
      );
  }
}
