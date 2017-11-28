import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

import { UserModel } from '../auth/store/user.model';

@Injectable()
export class AdvertiserGuard implements CanActivate {

  constructor(private router: Router, private store: Store<{auth}>) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.select('auth')
      .take(1)
      .map((authStore) => {
        const user: UserModel = authStore.userData

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
