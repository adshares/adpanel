import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

import { User } from 'models/user.model';
import { AppState } from 'models/app-state.model';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> {
    return this.store.select('state', 'user', 'data')
      .take(1)
      .map((userData: User) => {
        if (userData.data.isAdmin) {
          return true;
        } else {
          this.router.navigate(['/auth/login']);
        }

        return false;
      });
  }
}
