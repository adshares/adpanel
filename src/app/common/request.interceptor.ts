import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';

import { AppState } from 'models/app-state.model';
import { appSettings } from 'app-settings';
import { LocalStorageUser } from 'models/user.model';
import { PushNotificationsService } from 'common/components/push-notifications/push-notifications.service';
import { pushNotificationTypesEnum } from 'models/enum/push-notification.enum';

import { MatDialog } from '@angular/material/dialog';
import {ErrorResponseDialogComponent} from "common/dialog/error-response-dialog/error-response-dialog.component";
import {ErrorResponseDialogComponentNoResponse} from "common/dialog/error-response-dialog-no-response/error-response-dialog.component-no-response";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private pushNotificationsService: PushNotificationsService,
    private dialog: MatDialog
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.store.select('state', 'user', 'data', 'authToken')
      .take(1)
      .subscribe((authToken) => {
        if (authToken) {
          request = request.clone({
            setHeaders: {
              Authorization: authToken
            }
          });
        }
      });

      request = request.clone({
         withCredentials: true
      });

    return next.handle(request).do((event: HttpEvent<any>) => {
      this.extendTokenExpiration();

      return event;
    }, (err: any) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        localStorage.removeItem('adshUser');
        this.router.navigate(['/auth', 'login']);
      }
      if (err instanceof HttpErrorResponse && err.status === 0) {
          this.dialog.open(ErrorResponseDialogComponentNoResponse);
      }
      if (err instanceof HttpErrorResponse && err.status === 500) {
          this.dialog.open(ErrorResponseDialogComponent);
      }
      this.pushNotificationsService.addPushNotification({
        type: pushNotificationTypesEnum.ERROR,
        title: 'Error',
        message: 'Cannot connect to server'
      });
    });
  }

  extendTokenExpiration() {
    const localStorageUser: LocalStorageUser = JSON.parse(localStorage.getItem('adshUser'));

    if (!localStorageUser) {
      return;
    }

    const expirationSeconds = localStorageUser.remember ?
      appSettings.REMEMBER_USER_EXPIRATION_SECONDS : appSettings.AUTH_TOKEN_EXPIRATION_SECONDS;

    Object.assign(localStorageUser, { expiration: ((+new Date) / 1000 | 0) + expirationSeconds });

    localStorage.setItem('adshUser', JSON.stringify(localStorageUser));
  }
}
