import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { PublisherInfo } from 'models/settings.model';
import { AdminService } from 'admin/admin.service';
import { ImpersonationService } from '../../../impersonation/impersonation.service';
import { SessionService } from '../../../session.service';

@Component({
  selector: 'app-publisher-list-item',
  templateUrl: './publisher-list-item.component.html',
  styleUrls: ['./publisher-list-item.component.scss'],
})
export class PublisherListItemComponent {
  @Input() publisher: PublisherInfo;
  faIconImpersonation = faUserSecret;

  constructor(
    private adminService: AdminService,
    private impersonationService: ImpersonationService,
    private sessionService: SessionService,
    private router: Router,
  ) {
  }

  handleImpersonating(userId: number): void {
    this.adminService.impersonateUser(userId).subscribe(
      (token) => {
        this.impersonationService.setImpersonationToken(token);
        this.router.navigate(['/publisher', 'dashboard']);
        this.sessionService.setAccountTypeChoice('publisher');
      }
    )
  }
}
