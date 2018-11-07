import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from 'app/api/api.service';
import { SessionService } from 'app/session.service';

import { isUnixTimePastNow } from 'common/utilities/helpers';

@Injectable()
export class AuthService {

  constructor(
    private router: Router,
    private api: ApiService,
    private session: SessionService,
  ) {
  }

  logout() {
    this.api.auth.logout().subscribe(
      () => {
        this.session.drop();
        this.router.navigate(['/auth', 'login']);
      },
      () => {
        this.session.drop();
        this.router.navigate(['/auth', 'login']);
      }
    );
  }

  timeout() {
    const user = this.session.getUser();
    if (!user) {
      return;
    }
    if (!isUnixTimePastNow(user.expiration)) {
      return;
    }
    this.logout();
  }
}
