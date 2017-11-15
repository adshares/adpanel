import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm;
  @ViewChild('rememberUser') rememberUser: ElementRef;
  formSubmited = false;

  constructor(private cookieService: CookieService, private authService: AuthService) { }

  ngOnInit() {
    this.getSavedCredintials();
  }

  login() {
    this.formSubmited = true;
    // if (!this.loginForm.valid) {
    //   return;
    // }
    console.log('login', this.loginForm);

    this.authService.loginUser('aaa', 'bbb')
      .subscribe(
        () => {
          this.saveCredintials
        }
      );
  }

  saveCredintials() {
    if (!this.rememberUser.nativeElement.checked) {
      return;
    }

    this.cookieService.set('2', JSON.stringify(this.loginForm.value));
  }

  getSavedCredintials() {
    const savedCredintials = this.cookieService.get('2');

    if (savedCredintials) {
      const parsedCredintials = JSON.parse(savedCredintials);

      // this.loginForm.value({
      //   parsedCredintials
      // });
    }
  }
}
