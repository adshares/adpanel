import {Component} from '@angular/core';
import { Router} from '@angular/router';

import { AuthService } from 'auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import {MatDialog} from "@angular/material/dialog";
import { RegisterConfirmDialogComponent } from "common/dialog/register-confirm-dialog/register-confirm-dialog.component";

@Component({
  selector: 'app-register-confirm',
  templateUrl: './register-confirm.component.html',
  styleUrls: ['./register-confirm.component.scss'],
})

export class RegisterConfirmComponent  {
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
      if(chooseAccount && userData){
          if(chooseAccount == "Advertiser"){
              this.router.navigate(['/advertiser/dashboard']);
              this.dialog.open(RegisterConfirmDialogComponent);
          } else {
              this.router.navigate(['/publisher/dashboard']);
               this.dialog.open(RegisterConfirmDialogComponent);
          }
      }
  }
    emailActivation(token) {
        this.authService.emailActivation(token)
            .subscribe(
                () => this.router.navigate(['/auth', 'register-confirm']),
                (err) => {
                    console.log(err);
                    if(err.status == 403){
                        this.errorCode = {"error": true};
                    }
                }
            );
    }
}
