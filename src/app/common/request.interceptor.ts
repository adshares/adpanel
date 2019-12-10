import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
import { MatDialog } from '@angular/material/dialog';

import { appSettings } from 'app-settings';
import { LocalStorageUser } from 'models/user.model';
import { SessionService } from 'app/session.service';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';

import { PushNotificationsService } from 'common/components/push-notifications/push-notifications.service';
import { pushNotificationTypesEnum } from 'models/enum/push-notification.enum';
import { environment } from 'environments/environment.ts';
import { HandleSubscription } from 'common/handle-subscription';
import { ImpersonationService } from '../impersonation/impersonation.service';
import { HTTP_INTERNAL_SERVER_ERROR, HTTP_UNAUTHORIZED } from 'common/utilities/codes';

@Injectable()
export class RequestInterceptor extends HandleSubscription implements HttpInterceptor {
  openedErrorDialogs: number = 0;
  maxOpenedErrorDialogs: number = 1;

  constructor(
    private router: Router,
    private pushNotificationsService: PushNotificationsService,
    private dialog: MatDialog,
    private session: SessionService,
    private impersonationService: ImpersonationService
  ) {
    super()
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
      }
    });
    dialogRef.afterClosed().subscribe(
      () => {
        --this.openedErrorDialogs;
      }
    );
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.session.getUser() && this.session.getUser().apiToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.session.getUser().apiToken}`
        }
      });
    }

    const token = this.impersonationService.getTokenRawValue();

    if (token) {
      request = request.clone({
        setHeaders: {
          [`x-adshares-impersonation`]: token
        }
      });
    }

    if (environment.xdebug) {
      request = request.clone({
        setParams: {
          'XDEBUG_SESSION_START': 'PHPSTORM'
        }
      });
    }

    return next.handle(request).do(
      (event: HttpEvent<any>) => {
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
            this.dialogError('Session timed-out (server)', 'Last request required logged-in user but your session has been lost (outdated). Please log in again.');
          }

          return err;
        }

        if (err instanceof HttpErrorResponse && err.status === 0 && err.statusText == 'Unknown Error') {
          this.dialogError('Connection failed', 'Could not connect to our server API. Please check your Internet connection and try again.');
          // TODO: review during notification preparation
          this.pushNotificationsService.addPushNotification({
            type: pushNotificationTypesEnum.ERROR,
            title: 'Error',
            message: 'Cannot connect to server'
          });
          return err;
        }

        if (err instanceof HttpErrorResponse && err.status === HTTP_INTERNAL_SERVER_ERROR && (!err.url || -1 === err.url.indexOf('/check'))) {
          this.dialogError('Server request failed', 'It looks like our request failed on the server returning code 500, please try again or contact our support.');
          // TODO: review during notification preparation
          this.pushNotificationsService.addPushNotification({
            type: pushNotificationTypesEnum.ERROR,
            title: 'Error',
            message: 'Cannot connect to server'
          });
          return err;
        }

        return err;
      }
    );
  }

  // TODO: fix + location? // looks like bs, not what we are looking for
  extendTokenExpiration() {
    const user: LocalStorageUser = this.session.getUser();
    if (!user) {
      return;
    }
    const expirationSeconds = user.remember ? appSettings.REMEMBER_USER_EXPIRATION_SECONDS : appSettings.AUTH_TOKEN_EXPIRATION_SECONDS;
    Object.assign(user, {expiration: ((+new Date) / 1000 | 0) + expirationSeconds});
    this.session.setUser(user);
  }
}
