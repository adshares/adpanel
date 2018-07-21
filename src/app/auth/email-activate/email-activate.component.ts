import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SessionService } from "app/session.service";
import { AuthService } from 'auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { EmailActivateConfirmDialogComponent } from "common/dialog/email-activate-confirm-dialog/email-activate-confirm-dialog.component";
import { EmailActivateFailDialogComponent } from "common/dialog/email-activate-fail-dialog/email-activate-fail-dialog.component";

@Component({
  selector: 'app-email-activate',
  templateUrl: './email-activate.component.html',
  styleUrls: ['./email-activate.component.scss'],
})

export class EmailActivateComponent {
  token: any;
  ObjectKeys = Object.keys;
  error: boolean = false;
  constructor(
    private auth: AuthService,
    private session: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.token = params['token'];
      this.emailActivation(this.token);
    });
  }
  emailActivation(token) {
    this.auth.emailActivation(token)
      .subscribe(
        () => {
          const chooseAccount = this.session.getAccountTypeChoice();
          const userData = this.session.getUser();

          if (userData) {
            userData.isEmailConfirmed = true;
            this.session.setUser(userData);

            if (chooseAccount) {
              this.dialog.open(EmailActivateConfirmDialogComponent);
              this.router.navigate(['/' + chooseAccount, 'dashboard']);
              return;
            }
          }

          this.dialog.open(EmailActivateConfirmDialogComponent);
        },
        (err) => {
          this.error = true;

          const chooseAccount = this.session.getAccountTypeChoice();
          const userData = this.session.getUser();

          if (userData) {

            if (chooseAccount) {
              this.dialog.open(EmailActivateFailDialogComponent);
              this.router.navigate(['/' + chooseAccount, 'dashboard']);
              return;
            }
          }

          this.dialog.open(EmailActivateFailDialogComponent);
        }
      );
  }
}
