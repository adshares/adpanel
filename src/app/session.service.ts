import { Injectable } from '@angular/core';
import { LocalStorageUser } from 'models/user.model';

@Injectable()
export class SessionService {

  setAccountTypeChoice(type: string) {
    localStorage.setItem('accountTypeChoice', type);
  }

  getAccountTypeChoice(): string {
    return localStorage.getItem('accountTypeChoice');
  }

  setUser(user: LocalStorageUser) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): LocalStorageUser {
    return JSON.parse(localStorage.getItem('user'));
  }

  dropUser() {
    localStorage.removeItem('user');
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
}
