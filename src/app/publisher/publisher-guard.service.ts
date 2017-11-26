import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';

import { UserModel } from '../auth/store/user.model';

@Injectable()
export class PublisherGuard implements CanActivate {
    user: UserModel;

    constructor(private router: Router, private store: Store<{auth}>) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        this.store.select('auth')
          .subscribe((authStore) => this.user = authStore.userData);

        if (this.user.isPublisher) {
          return true;
        } else {
          // todo change link to one that will tell user to update profile roles
          this.router.navigate(['/auth/login']);
        }
    }
}
