import { Component, Input, OnInit } from '@angular/core';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { PublisherService } from 'publisher/publisher.service';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SiteRank } from 'models/site.model';
import { pageRankInfoEnum } from 'models/enum/site.enum';

@Component({
  selector: 'app-domain-checker',
  templateUrl: './domain-checker.component.html',
  styleUrls: ['./domain-checker.component.scss'],
})
export class DomainCheckerComponent extends HandleSubscriptionComponent implements OnInit {
  private static readonly UPDATE_INTERVAL = 300000; //5 * 60 * 1000 = 5 minutes
  @Input() siteId: number;
  faQuestionCircle = faQuestionCircle;

  pageRank: number = 0;
  pageRankInfo: string = '';
  inVerification: boolean = true;
  isBanned: boolean = false;

  constructor(private publisherService: PublisherService) {
    super();
  }

  ngOnInit(): void {
    const domainCheckSubscription = timer(0, DomainCheckerComponent.UPDATE_INTERVAL)
      .pipe(switchMap(() => this.publisherService.getSiteRank(this.siteId)))
      .subscribe(
        (response: SiteRank) => {
          this.updateMessage(response.rank || 0, response.info || pageRankInfoEnum.UNKNOWN);
        },
        () => this.updateMessage(0, pageRankInfoEnum.UNKNOWN)
      );

    this.subscriptions.push(domainCheckSubscription);
  }

  updateMessage(pageRank: number, pageRankInfo: string): void {
    this.inVerification = 0 === pageRank && pageRankInfoEnum.UNKNOWN === pageRankInfo;
    this.isBanned = !this.inVerification && pageRank <= 0;
    this.pageRank = Math.round(pageRank * 10);
    this.pageRankInfo = this.tooltipPageRankInfo(pageRankInfo);
  }

  cpaQuality(): string {
    return this.inVerification || this.pageRank != 0 ? 'great' : 'bad';
  }

  cpmQuality(): string {
    if (this.inVerification) {
      return 'medium';
    }

    let quality;
    if (this.pageRank > 0) {
      quality = 'great';
    } else {
      quality = 'bad';
    }

    return quality;
  }

  cpaMessage(): string {
    return this.inVerification || this.pageRank != 0 ? 'approved' : 'banned';
  }

  cpmMessage(): string {
    if (this.inVerification) {
      return 'in verification';
    } else if (this.isBanned) {
      return 'banned';
    } else {
      return 'approved';
    }
  }

  cpaTooltip(): string {
    return this.inVerification || this.pageRank != 0
      ? 'Your site has been approved for CPA campaigns.'
      : 'CPA campaigns have been excluded from your site. ' + this.pageRankInfo;
  }

  cpmTooltip(): string {
    if (this.inVerification) {
      return 'The domain is waiting for verification. CPM campaigns will not display until then.';
    }

    if (this.isBanned) {
      return 'CPM campaigns have been excluded from your site. ' + this.pageRankInfo;
    }

    return 'Your site has been approved for CPM campaigns.';
  }

  tooltipPageRankInfo(pageRankInfo: string): string {
    let info = '';

    switch (pageRankInfo) {
      case pageRankInfoEnum.HIGH_IVR:
        info = 'The invalid view rate is too high. Your website does not meet our quality standards.';
        break;
      case pageRankInfoEnum.HIGH_CTR:
        info = 'The click-through rate is too high. Your website does not meet our quality standards.';
        break;
      case pageRankInfoEnum.LOW_CTR:
        info =
          'The click-through rate is too low. Please try placing placements in a more visible places. You can also check if you are using the most popular placement sizes.';
        break;
      case pageRankInfoEnum.POOR_TRAFFIC:
        info = 'Poor traffic.  Your website does not meet our quality standards.';
        break;
      case pageRankInfoEnum.POOR_CONTENT:
        info =
          'Please make sure to have quality content on your site. We don’t allow sites that have no other content than ads.';
        break;
      case pageRankInfoEnum.SUSPICIOUS_DOMAIN:
        info = 'We don’t allow newly created domains and domains that are not present in public indexes.';
        break;
      case pageRankInfoEnum.NOT_WORKING:
        info = 'The site is not responding or reports an error.';
        break;
    }

    return info;
  }
}
