import { Injectable } from '@angular/core';

import { LocalStorageUser } from 'models/user.model';
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

  drop(): void {
    this.isActive = false;
    localStorage.removeItem('user');
    this.impersonationService.dropImpersonationToken();
  }

  getAccountTypeChoice(): string {
    return localStorage.getItem('accountTypeChoice');
  }

  getUser(): LocalStorageUser | null {
    return JSON.parse(localStorage.getItem('user'));
  }

  getUserLabel(): string {
    const user = this.getUser();
    if (user.email && user.email.indexOf('@') > 0) {
      const parts = user.email.split('@');
      const name = parts[0].length > 2 ? parts[0].slice(0, 2) : parts[0];
      return `${name}***@${parts[1]}`;
    }
    if (user.adserverWallet.walletAddress) {
      const address = user.adserverWallet.walletAddress;
      return `${address.slice(0, 5)}…${address.slice(-5)}`;
    }
    return '';
  }

  isAdmin(): boolean {
    let u = this.getUser();
    return u ? !!u.isAdmin : false;
  }

  isModerator(): boolean {
    let u = this.getUser();
    return u ? !!u.isModerator || !!u.isAdmin : false;
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

  setUser(user: LocalStorageUser): void {
    this.isActive = true;
    localStorage.setItem('user', JSON.stringify(user));
  }

  isImpersonated(): boolean {
    return this.impersonationService.getTokenFromStorage() !== null;
  }
}
