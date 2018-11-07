import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

import { SessionService } from "app/session.service";

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean
}

@Injectable()
export class AdvertiserGuard implements CanActivate, CanDeactivate<CanComponentDeactivate> {

  constructor(
    private router: Router,
    private session: SessionService,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot
  ): boolean {
    return this.session.isAdvertiser();
  }

  canDeactivate(component: CanComponentDeactivate): Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate();
  }
}
