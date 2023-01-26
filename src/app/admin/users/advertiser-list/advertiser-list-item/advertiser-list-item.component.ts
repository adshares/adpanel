import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { AdvertiserInfo } from 'models/settings.model';
import { AdminService } from 'admin/admin.service';
import { ImpersonationService } from '../../../../impersonation/impersonation.service';
import { SessionService } from '../../../../session.service';
import { User } from 'models/user.model';

@Component({
  selector: 'app-advertiser-list-item',
  templateUrl: './advertiser-list-item.component.html',
  styleUrls: ['./advertiser-list-item.component.scss'],
})
export class AdvertiserListItemComponent {
  @Input() advertiser: AdvertiserInfo;
  loggedUser: User;
  faIconImpersonation = faUserSecret;

  constructor(
    private adminService: AdminService,
    private impersonationService: ImpersonationService,
    private sessionService: SessionService,
    private router: Router
  ) {
    this.loggedUser = sessionService.getUser();
  }

  canImpersonate(userId: number): boolean {
    return userId !== this.loggedUser.id;
  }

  handleImpersonating(userId: number): void {
    this.adminService.impersonateUser(userId).subscribe(token => {
      this.impersonationService.setImpersonationToken(token);
      this.router.navigate(['/advertiser', 'dashboard']);
      this.sessionService.setAccountTypeChoice(SessionService.ACCOUNT_TYPE_ADVERTISER);
    });
  }
}
