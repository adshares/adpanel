import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImpersonationService } from '../impersonation.service';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { SessionService } from '../../session.service';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import { User } from 'models/user.model';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-impersonation',
  templateUrl: './impersonation.component.html',
  styleUrls: ['./impersonation.component.scss'],
})
export class ImpersonationComponent extends HandleSubscriptionComponent implements OnInit {
  impersonationToken: boolean = false;
  userLabel: string;
  userEmail: string;
  userId: number;
  userIsBanned: boolean;
  faTriangleExclamation = faTriangleExclamation;

  constructor(
    private router: Router,
    private impersonationService: ImpersonationService,
    private sessionService: SessionService,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit() {
    const subscription = this.impersonationService
      .getImpersonationToken()
      .subscribe(token => (this.impersonationToken = !!token));
    this.subscriptions.push(subscription);
    this.impersonationService.getTokenFromStorage();
    this.store.select('state', 'user', 'data').subscribe((user: User) => {
      this.userLabel = user.email || user.adserverWallet.walletAddress;
      this.userEmail = user.email;
      this.userId = user.id;
      this.userIsBanned = user.isBanned;
    });
  }

  dropImpersonation(): void {
    this.router.navigate(['/admin', 'dashboard', 'users']);
    this.impersonationService.dropImpersonationToken();
    const user = this.sessionService.getUser();
    let accountType;
    if (user.isAdmin) {
      accountType = SessionService.ACCOUNT_TYPE_ADMIN;
    } else if (user.isModerator) {
      accountType = SessionService.ACCOUNT_TYPE_MODERATOR;
    } else if (user.isAgency) {
      accountType = SessionService.ACCOUNT_TYPE_AGENCY;
    }
    this.sessionService.setAccountTypeChoice(accountType);
  }
}
