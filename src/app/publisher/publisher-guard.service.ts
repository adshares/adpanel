import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

import { SessionService } from "app/session.service";

@Injectable()
export class PublisherGuard implements CanActivate {

  constructor(
    private router: Router,
    private session: SessionService,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot
  ): boolean {
    return this.session.isPublisher();
  }
}
