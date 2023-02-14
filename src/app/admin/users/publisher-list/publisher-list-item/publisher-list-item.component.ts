import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { PublisherInfo } from 'models/settings.model';
import { AdminService } from 'admin/admin.service';
import { ImpersonationService } from '../../../../impersonation/impersonation.service';
import { SessionService } from '../../../../session.service';
import { pageRankInfoEnum } from 'models/enum/site.enum';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import { DECENTRALAND_BUILDER } from 'models/enum/link.enum';
import { User } from 'models/user.model';
import { CryptovoxelsConverter } from 'common/utilities/targeting-converter/cryptovoxels-converter';
import { DecentralandConverter } from 'common/utilities/targeting-converter/decentraland-converter';

@Component({
  selector: 'app-publisher-list-item',
  templateUrl: './publisher-list-item.component.html',
  styleUrls: ['./publisher-list-item.component.scss'],
})
export class PublisherListItemComponent implements OnInit {
  @Input() publisher: PublisherInfo;
  loggedUser: User;
  adUserInfoUrl: string;
  faIconImpersonation = faUserSecret;

  constructor(
    private store: Store<AppState>,
    private adminService: AdminService,
    private impersonationService: ImpersonationService,
    private sessionService: SessionService,
    private router: Router
  ) {
    this.loggedUser = sessionService.getUser();
  }

  ngOnInit(): void {
    this.store
      .select('state', 'admin', 'settings')
      .pipe(take(1))
      .subscribe(settings => {
        this.adUserInfoUrl = settings.adUserInfoUrl;
      });
  }

  canImpersonate(userId: number): boolean {
    return userId !== this.loggedUser.id;
  }

  handleImpersonating(userId: number): void {
    this.adminService.impersonateUser(userId).subscribe(token => {
      this.impersonationService.setImpersonationToken(token);
      this.router.navigate(['/publisher', 'dashboard']);
      this.sessionService.setAccountTypeChoice(SessionService.ACCOUNT_TYPE_PUBLISHER);
    });
  }

  domainsInfo(publisher: PublisherInfo) {
    const domains = publisher.domain.split(',');
    const ranks = publisher.rank.split(',');
    const infos = publisher.info.split(',');
    const urls = publisher.url.split(',');

    const list = {};
    domains.forEach((name, index) => {
      const domain = name.trim();

      let presentedName = domain;
      let url = (urls[index] || '').trim();
      if (PublisherListItemComponent.isDecentralandDomain(domain)) {
        if ('scene-0-0.decentraland.org' === domain) {
          presentedName = 'DCL Builder';
          url = DECENTRALAND_BUILDER;
        } else {
          const converter = new DecentralandConverter();
          presentedName = `Decentraland ${converter.decodeValue(domain)}`;
          if (url.length > 0) {
            url = converter.convertBackendUrlToValidUrl(url);
          }
        }
      } else if (PublisherListItemComponent.isCryptovoxelsDomain(domain)) {
        const converter = new CryptovoxelsConverter();
        presentedName = `Cryptovoxels ${converter.decodeValue(domain)}`;
        if (url.length > 0) {
          url = converter.convertBackendUrlToValidUrl(url);
        }
      }
      list[domain] = {
        domain: domain,
        name: presentedName,
        rank: parseFloat(ranks[index] || '0'),
        info: (infos[index] || pageRankInfoEnum.UNKNOWN).trim(),
        url: url,
      };
    });
    return Object.values(list);
  }

  private static isDecentralandDomain(domain: string): boolean {
    return null !== domain.match(/^scene-n?\d+-n?\d+.decentraland.org/);
  }

  private static isCryptovoxelsDomain(domain: string): boolean {
    return null !== domain.match(/^scene-\d+.cryptovoxels.com/);
  }

  pageRank(rank: number): number {
    return rank > 0 ? Math.round(rank * 10) : 0;
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

    return `great`;
  }

  getAdUserInfoUrl(domain: string): string {
    return this.adUserInfoUrl.replace('{domain}', domain);
  }
}
