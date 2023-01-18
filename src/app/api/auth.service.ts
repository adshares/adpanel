import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { buildUrl } from 'common/utilities/helpers';
import { environment } from 'environments/environment';
import { OAuthAuthorizeResponse, User } from 'models/user.model';
import { WalletToken } from 'models/settings.model';

@Injectable()
export class ApiAuthService {
  constructor(private http: HttpClient) {}

  // user access
  check(): Observable<User> {
    return this.http.get<User>(`${environment.authUrl}/check`);
  }

  logout() {
    return this.http.get(`${environment.authUrl}/logout`);
  }

  // guest access
  recoveryGet(token: string) {
    return this.http.get(`${environment.authUrl}/recovery/${token}`);
  }

  recoveryPost(email: string, uri: string) {
    return this.http.post(`${environment.authUrl}/recovery`, { email, uri });
  }

  // ANY access
  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${environment.authUrl}/login`, {
      email,
      password,
    });
  }

  initWalletLogin(): Observable<WalletToken> {
    return this.http.get<WalletToken>(`${environment.authUrl}/login/wallet/init`);
  }

  walletLogin(
    network: string,
    address: string,
    token: string,
    signature: string,
    referralToken: string = null
  ): Observable<User> {
    const body = { network, address, token, signature };
    if (null !== referralToken) {
      body['referralToken'] = referralToken;
    }
    return this.http.post<User>(`${environment.authUrl}/login/wallet`, body);
  }

  oauthAuthorize(url: string): Observable<OAuthAuthorizeResponse> {
    return this.http.get<OAuthAuthorizeResponse>(buildUrl(url, ['no_redirect=true']), { withCredentials: true });
  }
}
