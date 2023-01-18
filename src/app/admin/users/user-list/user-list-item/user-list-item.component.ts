import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { faCheck, faEnvelope, faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { UserInfo } from 'models/settings.model';
import { AdminService } from 'admin/admin.service';
import { AppState } from 'models/app-state.model';
import { ImpersonationService } from '../../../../impersonation/impersonation.service';
import { SessionService } from '../../../../session.service';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { CODE, CRYPTO } from 'common/utilities/consts';
import { User } from 'models/user.model';
import { ServerOptionsService } from 'common/server-options.service';

@Component({
  selector: 'app-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.scss'],
})
export class UserListItemComponent extends HandleSubscriptionComponent implements OnInit {
  @Input() user: UserInfo;
  loggedUser: User;
  faIconEmailConfirmed = faEnvelope;
  faIconAdminConfirmed = faCheck;
  crypto: string = CRYPTO;
  code: string = CODE;
  calculateFunds: boolean;
  faIconImpersonation = faUserSecret;

  constructor(
    private adminService: AdminService,
    private serverOptionsService: ServerOptionsService,
    private store: Store<AppState>,
    private impersonationService: ImpersonationService,
    private sessionService: SessionService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loggedUser = this.sessionService.getUser();
    const options = this.serverOptionsService.getOptions();
    this.calculateFunds = options.displayCurrency !== options.appCurrency;
  }

  handleImpersonating(): void {
    this.adminService.impersonateUser(this.user.id).subscribe(token => {
      this.impersonationService.setImpersonationToken(token);
      if (this.user.isPublisher) {
        this.router.navigate(['/publisher', 'dashboard']);
        this.sessionService.setAccountTypeChoice(SessionService.ACCOUNT_TYPE_PUBLISHER);
      } else {
        this.router.navigate(['/advertiser', 'dashboard']);
        this.sessionService.setAccountTypeChoice(SessionService.ACCOUNT_TYPE_ADVERTISER);
      }
    });
  }

  get canImpersonate(): boolean {
    return !this.user.isAdmin && !this.user.isModerator && this.user.id !== this.loggedUser.id;
  }

  get userRole(): string {
    if (this.user.isAdmin) {
      return 'Admin';
    } else if (this.user.isBanned) {
      return 'Banned';
    } else if (this.user.isModerator) {
      return 'Moderator';
    } else if (this.user.isAgency) {
      return 'Agency';
    } else if (this.user.isAdvertiser) {
      return this.user.isPublisher ? 'Adv / Pub' : 'Advertiser';
    } else if (this.user.isPublisher) {
      return 'Publisher';
    } else {
      return 'No role';
    }
  }

  get userRoleTitle(): string {
    if (this.user.isAdmin) {
      return 'Administrator';
    } else if (this.user.isBanned) {
      return 'Banned';
    } else if (this.user.isModerator) {
      return 'Moderator';
    } else if (this.user.isAgency) {
      return 'Agency';
    } else if (this.user.isAdvertiser) {
      return this.user.isPublisher ? 'Advertiser and Publisher' : 'Advertiser';
    } else if (this.user.isPublisher) {
      return 'Publisher';
    } else {
      return 'User has no advertiser nor publisher role';
    }
  }
}
