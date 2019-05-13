import { EventEmitter, Injectable } from '@angular/core';

const IMPERSONATION_TOKEN = 'impersonationToken';

@Injectable()
export class ImpersonationService {
  impersonationMode: EventEmitter<string | null> = new EventEmitter<string | null>();

  constructor() {
  }

  setImpersonationToken(token: string) {
    localStorage.setItem(IMPERSONATION_TOKEN, token);
    this.impersonationMode.emit(token)
  }

  getTokenFromStorage() {
    const token = localStorage.getItem(IMPERSONATION_TOKEN);
    this.impersonationMode.emit(token);
  }

  getImpersonationToken(): EventEmitter<null | string> {
    return this.impersonationMode;
  }

  dropImpersonationToken() {
    localStorage.removeItem(IMPERSONATION_TOKEN);
    this.impersonationMode.emit(null)
  }
}
