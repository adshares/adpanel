import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { appSettings } from 'app-settings';
import { LocalStorageUser } from 'models/user.model';
import { SessionService } from 'app/session.service';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';
import { environment } from 'environments/environment';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { ImpersonationService } from '../impersonation/impersonation.service';
import { HTTP_INTERNAL_SERVER_ERROR, HTTP_SERVICE_UNAVAILABLE, HTTP_UNAUTHORIZED } from 'common/utilities/codes';

@Injectable()
export class RequestInterceptor extends HandleSubscriptionComponent implements HttpInterceptor {
  openedErrorDialogs: number = 0;
  maxOpenedErrorDialogs: number = 1;

  private readonly connectionErrorMaxPeriodWithoutNotification = 20000; // 20 seconds
  private connectionErrorFirstTimestamp?: number = null;
  private connectionErrorHandled: boolean = false;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private session: SessionService,
    private impersonationService: ImpersonationService
  ) {
    super();
  }

  dialogError(title, message) {
    if (this.openedErrorDialogs >= this.maxOpenedErrorDialogs) {
      return;
    }
    ++this.openedErrorDialogs;
    let dialogRef = this.dialog.open(ErrorResponseDialogComponent, {
      data: {
        title: title,
        message: message,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      --this.openedErrorDialogs;
    });
  }

  private onConnectionSuccess(): void {
    this.connectionErrorFirstTimestamp = null;
    this.connectionErrorHandled = false;
  }

  private onConnectionFailure(): void {
    if (null === this.connectionErrorFirstTimestamp) {
      this.connectionErrorFirstTimestamp = Date.now();
    }

    if (
      Date.now() - this.connectionErrorFirstTimestamp > this.connectionErrorMaxPeriodWithoutNotification &&
      !this.connectionErrorHandled
    ) {
      this.connectionErrorHandled = true;

      this.dialogError(
        'Connection failed',
        'Could not connect to our server API. Please check your Internet connection and try again.'
      );
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.session.getUser() && this.session.getUser().apiToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.session.getUser().apiToken}`,
        },
      });
    }

    const token = this.impersonationService.getTokenRawValue();

    if (token) {
      request = request.clone({
        setHeaders: {
          [`x-adshares-impersonation`]: token,
        },
      });
    }

    if (environment.xdebug) {
      request = request.clone({
        setParams: {
          XDEBUG_SESSION_START: 'PHPSTORM',
        },
      });
    }

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (HttpEventType.Response === event.type) {
            this.onConnectionSuccess();
          }
          this.extendTokenExpiration();
          return event;
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse && err.status === HTTP_UNAUTHORIZED) {
            const noUser = !this.session.getUser();
            const isSessionActive = this.session.isActive;
            this.session.drop();
            this.router.navigate(['/auth', 'login']);

            if (!isSessionActive) {
              return err;
            }

            if (noUser) {
              this.dialogError('Login required', 'Last request required logged-in user.');
            } else {
              this.dialogError(
                'Session timed-out (server)',
                'Last request required logged-in user but your session has been lost (outdated). Please log in again.'
              );
            }

            return err;
          }

          if (err instanceof HttpErrorResponse && err.status === HTTP_SERVICE_UNAVAILABLE) {
            this.session.drop();
            this.router.navigate(['/503']);
            return err;
          }

          if (err instanceof HttpErrorResponse && err.status === 0 && err.statusText === 'Unknown Error') {
            this.onConnectionFailure();
            return err;
          }

          if (
            err instanceof HttpErrorResponse &&
            err.status === HTTP_INTERNAL_SERVER_ERROR &&
            (!err.url || -1 === err.url.indexOf('/check'))
          ) {
            this.dialogError(
              'Server request failed',
              'It looks like our request failed on the server returning code 500, please try again or contact our support.'
            );
            return err;
          }

          return err;
        }
      )
    );
  }

  extendTokenExpiration() {
    const user: LocalStorageUser = this.session.getUser();
    if (!user) {
      return;
    }
    const expirationSeconds = user.remember
      ? appSettings.REMEMBER_USER_EXPIRATION_SECONDS
      : appSettings.AUTH_TOKEN_EXPIRATION_SECONDS;
    Object.assign(user, {
      expiration: ((+new Date() / 1000) | 0) + expirationSeconds,
    });
    this.session.setUser(user);
  }
}
