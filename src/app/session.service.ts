import {Injectable} from '@angular/core';

import {Notification} from 'models/notification.model';
import {LocalStorageUser} from 'models/user.model';
import {AppState} from "models/app-state.model";
import {Store} from "@ngrx/store";
import {SetUser} from "store/auth/auth.actions";

@Injectable()
export class SessionService {

  constructor(private store: Store<AppState>) {}

  drop() {
    localStorage.removeItem('adsharesAddress');
    localStorage.removeItem('notifications');
    localStorage.removeItem('user');
  }

  getAccountTypeChoice(): string {
    return localStorage.getItem('accountTypeChoice');
  }

  getAdsharesAddress(): string {
    return localStorage.getItem('adsharesAddress');
  }

  getNotifications(): Notification[] {
    return JSON.parse(localStorage.getItem('notifications'));
  }

  getNotificationsCount(): number {
    const notifications = this.getNotifications();
    if (!notifications) {
      return 0;
    }
    return notifications.length;
  }

  getUser(): LocalStorageUser {
    return JSON.parse(localStorage.getItem('user'));
  }

  isAdmin(): boolean {
    let u = this.getUser();
    return u ? (u.isAdmin ? true : false) : false;
  }

  isAdvertiser(): boolean {
    let u = this.getUser();
    return u ? (u.isAdvertiser ? true : false) : false;
  }

  isPublisher(): boolean {
    let u = this.getUser();
    return u ? (u.isPublisher ? true : false) : false;
  }

  setAccountTypeChoice(type: string) {
    localStorage.setItem('accountTypeChoice', type);
  }

  setAdsharesAddress(adsharesAddress: string) {
    localStorage.setItem('adsharesAddress', adsharesAddress);
  }

  setNotifications(notifications: Notification[]) {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }

  setUser(user: LocalStorageUser) {
    localStorage.setItem('user', JSON.stringify(user));
    this.store.dispatch(new SetUser(user));
  }
}
