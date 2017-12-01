import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

import { UserModel } from '../models/user.model';

@Injectable()
export class AdvertiserGuard implements CanActivate {

  constructor(private router: Router, private store: Store<{state}>) { }

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> {
    return this.store.select('state')
      .take(1)
      .map((state) => {
        const user: UserModel = state.auth.userData

        if (user.isAdvertiser) {
          return true;
        } else {
          // todo change link to one that will tell user to update profile roles
          this.router.navigate(['/auth/login']);
        }

        return false;
      });
  }
}
