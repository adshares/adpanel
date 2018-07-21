import { Injectable } from '@angular/core';
import { LocalStorageUser } from 'models/user.model';

@Injectable()
export class SessionService {

  dropUser() {
    localStorage.removeItem('user');
  }

  getAccountTypeChoice(): string {
    return localStorage.getItem('accountTypeChoice');
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

  setUser(user: LocalStorageUser) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}
