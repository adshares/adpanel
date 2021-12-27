import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImpersonationService } from "../impersonation.service";
import { HandleSubscription } from "common/handle-subscription";
import { SessionService } from "../../session.service";

@Component({
  selector: 'app-impersonation',
  templateUrl: './impersonation.component.html',
  styleUrls: ['./impersonation.component.scss'],
})
export class ImpersonationComponent extends HandleSubscription implements OnInit {
  impersonationToken: boolean = false;
  userLabel: string

  constructor(
    private router: Router,
    private impersonationService: ImpersonationService,
    private sessionService: SessionService
  ) {
    super();
  }

  ngOnInit() {
    const subscription = this.impersonationService.getImpersonationToken().subscribe(
      token => this.impersonationToken = !!token
    );
    this.subscriptions.push(subscription);
    this.impersonationService.getTokenFromStorage();
    if (this.sessionService.isImpersonated()) {
      const user = this.sessionService.getImpersonatedUser()
      this.userLabel = user.email || user.adserverWallet.walletAddress
    }
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
