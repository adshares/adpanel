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
  }

  dropImpersonation(): void {
    this.router.navigate(['/admin', 'dashboard', 'users']);
    this.impersonationService.dropImpersonationToken();
    this.sessionService.setAccountTypeChoice(SessionService.ACCOUNT_TYPE_ADMIN);
  }
}
