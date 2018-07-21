import {
  Router,
  CanActivate,
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

import { SessionService } from "app/session.service";
import { LocalStorageUser } from 'models/user.model';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean
}

@Injectable()
export class AdvertiserGuard implements CanActivate, CanDeactivate<CanComponentDeactivate> {

  constructor(
    private router: Router,
    private session: SessionService,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot
  ): boolean {
    return this.session.isAdvertiser();
  }

  canDeactivate(component: CanComponentDeactivate): Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate();
  }
}
