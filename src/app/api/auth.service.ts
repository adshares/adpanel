import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'environments/environment'
import { User } from 'models/user.model'
import { WalletToken } from 'models/settings.model'

@Injectable()
export class ApiAuthService {

  constructor (private http: HttpClient) {}

  // user access
  check (): Observable<User> {
    return this.http.get<User>(`${environment.authUrl}/check`)
  }

  logout () {
    return this.http.get(`${environment.authUrl}/logout`)
  }

  // guest access
  recoveryGet (token: string) {
    return this.http.get(`${environment.authUrl}/recovery/${token}`)
  }

  recoveryPost (email: string, uri: string) {
    return this.http.post(`${environment.authUrl}/recovery`, { email, uri })
  }

  // ANY access
  login (email: string, password: string): Observable<User> {
    return this.http.post<User>(`${environment.authUrl}/login`, { email, password })
  }

  initWalletLogin (): Observable<WalletToken> {
    return this.http.get<WalletToken>(`${environment.authUrl}/login/wallet/init`)
  }

  walletLogin (network: string, address: string, token: string, signature: string): Observable<User> {
    return this.http.post<User>(`${environment.authUrl}/login/wallet`, { network, address, token, signature })
  }
}
