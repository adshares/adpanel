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
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
      this.route.params.subscribe(params => {
          this.token = params['token']; // (+) converts string 'id' to a number
          this.emailActivation(this.token);
          // In a real app: dispatch action to load the details here.
      });
  }
    emailActivation(token) {
        this.authService.emailActivation(token)
            .subscribe(
                (err) => {
                    // this.errorsRegister = err.error.errors;
                }
            );
    }
}
