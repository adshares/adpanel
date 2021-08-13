import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { AdminSettings, PublisherInfo } from 'models/settings.model'
import { AdminService } from 'admin/admin.service';
import { ImpersonationService } from '../../../impersonation/impersonation.service';
import { SessionService } from '../../../session.service';
import { pageRankInfoEnum } from 'models/enum/site.enum'
import { Store } from '@ngrx/store'
import { AppState } from 'models/app-state.model'

@Component({
  selector: 'app-publisher-list-item',
  templateUrl: './publisher-list-item.component.html',
  styleUrls: ['./publisher-list-item.component.scss'],
})
export class PublisherListItemComponent implements OnInit {
  @Input() publisher: PublisherInfo;
  settings: AdminSettings;
  faIconImpersonation = faUserSecret;

  constructor(
    private store: Store<AppState>,
    private adminService: AdminService,
    private impersonationService: ImpersonationService,
    private sessionService: SessionService,
    private router: Router,
  ) {
  }

  ngOnInit () {
    this.store.select('state', 'admin',
      'settings').take(1).subscribe((settings: AdminSettings) => {
      this.settings = settings
    })
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

  domainsInfo(publisher: PublisherInfo) {
    const domains = publisher.domain.split(',');
    const ranks = publisher.rank.split(',');
    const infos = publisher.info.split(',');
    const urls = publisher.url.split(',');

    const list = {};
    domains.forEach((name, index) => {
      const domain = name.trim();
      list[domain] = {
        name: domain,
        rank: parseFloat(ranks[index] || '0'),
        info: (infos[index] || pageRankInfoEnum.UNKNOWN).trim(),
        url: (urls[index] || '').trim(),
      }
    })
    return Object.values(list);
  }

  pageRank(rank: number): number {
    return rank > 0 ? Math.round(rank * 10): 0;
  }

  rankQuality(rank: number, info: string): string {
    const inVerification = 0.0 === rank && pageRankInfoEnum.UNKNOWN === info;
    const isBanned = !inVerification && rank <= 0;

    if (isBanned) {
      return 'bad';
    }
    if (inVerification) {
      return 'none';
    }
    if (rank < 0.7) {
      return 'medium';
    }
    if (rank < 1) {
      return 'good';
    }

    return `great`
  }

  aduserInfoUrl(domain: string): string
  {
    return this.settings.aduserInfoUrl.replace('{domain}', domain);
  }
}
