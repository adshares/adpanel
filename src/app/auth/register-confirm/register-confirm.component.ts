import {Component} from '@angular/core';
import { Router} from '@angular/router';

import { AuthService } from 'auth/auth.service';

@Component({
  selector: 'app-register-confirm',
  templateUrl: './register-confirm.component.html',
  styleUrls: ['./register-confirm.component.scss'],
})

export class RegisterConfirmComponent  {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

  }
}
