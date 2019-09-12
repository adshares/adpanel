import { Injectable } from '@angular/core';

import { Notification } from 'models/notification.model';
import { LocalStorageUser } from 'models/user.model';
import { ImpersonationService } from './impersonation/impersonation.service';

@Injectable()
export class SessionService {
  public static readonly ACCOUNT_TYPE_ADMIN: string = 'admin';
  public static readonly ACCOUNT_TYPE_ADVERTISER: string = 'advertiser';
  public static readonly ACCOUNT_TYPE_PUBLISHER: string = 'publisher';

  isActive: boolean;

  constructor(private impersonationService: ImpersonationService) {}

  drop() {
    this.isActive = false;
    localStorage.removeItem('adsharesAddress');
    localStorage.removeItem('notifications');
    localStorage.removeItem('user');
    this.impersonationService.dropImpersonationToken();
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

  getUser(): LocalStorageUser|null {
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
    this.isActive = true;
    localStorage.setItem('user', JSON.stringify(user));
  }
}
