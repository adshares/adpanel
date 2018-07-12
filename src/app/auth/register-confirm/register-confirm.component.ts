import {Component} from '@angular/core';
import { Router} from '@angular/router';

import { AuthService } from 'auth/auth.service';
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
      this.route.params.subscribe(params => {
          this.token = params['token'];
          this.emailActivation(this.token);
      });
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
