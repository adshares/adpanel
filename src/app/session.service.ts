import { Injectable } from '@angular/core';

import { AdsharesAddress } from 'models/settings.model';
import { Notification } from 'models/notification.model';
import { LocalStorageUser } from 'models/user.model';

@Injectable()
export class SessionService {

  dropUser() {
    localStorage.removeItem('user');
  }

  getAccountTypeChoice(): string {
    return localStorage.getItem('accountTypeChoice');
  }

  getAdsharesAddress(): string {
    return localStorage.getItem('adsharesAddress');
  }

  getUser(): LocalStorageUser {
    return JSON.parse(localStorage.getItem('user'));
  }

  isAdmin(): boolean {
    let u = this.getUser();
    return u ? (u.isAdmin ? true : false ) : false;
  }

  isAdvertiser(): boolean {
    let u = this.getUser();
    return u ? (u.isAdvertiser ? true : false ) : false;
  }

  isPublisher(): boolean {
    let u = this.getUser();
    return u ? (u.isPublisher ? true : false ) : false;
  }

  setAccountTypeChoice(type: string) {
    localStorage.setItem('accountTypeChoice', type);
  }

  setAdsharesAddress(adsharesAddress: string) {
    localStorage.setItem('adsharesAddress', adsharesAddress);
  }

  setUser(user: LocalStorageUser) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}
