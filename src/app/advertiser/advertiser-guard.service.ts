import { Router, CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

import { User } from '../models/user.model';
import { AppState } from '../models/app-state.model';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean
}

@Injectable()
export class AdvertiserGuard implements CanActivate, CanDeactivate<CanComponentDeactivate> {

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> {
    return this.store.select('state', 'auth', 'userData')
      .take(1)
      .map((userData: User) => {
        if (userData.isAdvertiser) {
          return true;
        } else {
          // todo change link to one that will tell user to update profile roles
          this.router.navigate(['/auth/login']);
        }

        return false;
      });
  }

  canDeactivate(component: CanComponentDeactivate): Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate();
  }
}
