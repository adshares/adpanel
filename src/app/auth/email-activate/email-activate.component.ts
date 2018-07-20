import {Component} from '@angular/core';
import { Router} from '@angular/router';

import { AuthService } from 'auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import {MatDialog} from "@angular/material/dialog";
import { EmailActivateConfirmDialogComponent } from "common/dialog/email-activate-confirm-dialog/email-activate-confirm-dialog.component";

@Component({
  selector: 'app-email-activate',
  templateUrl: './email-activate.component.html',
  styleUrls: ['./email-activate.component.scss'],
})

export class EmailActivateComponent  {
  token: any;
  ObjectKeys = Object.keys;
  errorsRegister: {};
  errorCode: {}
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
      const chooseAccount = localStorage.getItem("choose");
      const userData = localStorage.getItem("adshUser");
      this.route.params.subscribe(params => {
          this.token = params['token'];
          this.emailActivation(this.token);
      });
      const savedUser = JSON.parse(localStorage.getItem('adshUser'));
      savedUser.isEmailConfirmed=true;
      localStorage.setItem("adshUser",JSON.stringify(savedUser));
      if(chooseAccount && userData){
          if(chooseAccount == "Advertiser"){
              this.router.navigate(['/advertiser/dashboard']);
              this.dialog.open(EmailActivateConfirmDialogComponent);
              setTimeout(function(){window.location.reload()}, 2000)
          } else {
              this.router.navigate(['/publisher/dashboard']);
               this.dialog.open(EmailActivateConfirmDialogComponent);
              setTimeout(function(){window.location.reload()}, 2000)
          }
      }
  }
    emailActivation(token) {
        this.authService.emailActivation(token)
            .subscribe(
                () => [],
                (err) => {
                    console.log(err);
                    if(err.status == 403){
                        this.errorCode = {"error": true};
                    }
                }
            );
    }
}
