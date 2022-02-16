import { Injectable } from '@angular/core';

import { Notification } from 'models/notification.model';
import { LocalStorageUser } from 'models/user.model'
import { ImpersonationService } from './impersonation/impersonation.service';

@Injectable()
export class SessionService {
  public static readonly ACCOUNT_TYPE_ADMIN: string = 'admin';
  public static readonly ACCOUNT_TYPE_MODERATOR: string = 'moderator';
  public static readonly ACCOUNT_TYPE_AGENCY: string = 'agency';
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

  getUserLabel(): string {
    const user = this.getUser()
    if (user.email && user.email.length > 0) {
      const parts = user.email.split('@')
      const name = parts[0].length > 2 ? parts[0].slice(0, 2) : parts[0];
      return `${name}***@${parts[1]}`
    }
    if (user.adserverWallet.walletAddress) {
      const address = user.adserverWallet.walletAddress
      return `${address.slice(0, 5)}…${address.slice(-5)}`
    }
    return '';
  }

  isAdmin(): boolean {
    let u = this.getUser();
    return u ? !!u.isAdmin : false;
  }

  isModerator(): boolean {
    let u = this.getUser();
    return u ? (!!u.isModerator || !!u.isAdmin) : false;
  }

  isAgency(): boolean {
    let u = this.getUser();
    return u ? !!u.isAgency : false;
  }

  isAdvertiser(): boolean {
    let u = this.getUser();
    return u ? !!u.isAdvertiser : false;
  }

  isPublisher(): boolean {
    let u = this.getUser();
    return u ? !!u.isPublisher : false;
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

  isImpersonated(): boolean {
    return this.impersonationService.getTokenFromStorage() !== null
  }
}
