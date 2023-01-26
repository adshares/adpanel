import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SessionService } from 'app/session.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private session: SessionService) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.session.isAdmin()) {
      return true;
    }

    this.router.navigate(['/auth', 'login'], {
      queryParams: { redirectUrl: state.url },
    });

    return false;
  }
}
