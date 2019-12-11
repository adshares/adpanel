import { Component, Input, OnInit } from '@angular/core';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { HandleSubscription } from 'common/handle-subscription';
import { PublisherService } from 'publisher/publisher.service';
import { timer } from 'rxjs/observable/timer';

enum PageRankInfo {
  OK = 'ok',
  UNKNOWN = 'unknown',
  HIGH_IVR = 'high-ivr',
  HIGH_CTR = 'high-ctr',
  LOW_CTR = 'low-ctr',
  POOR_TRAFFIC = 'poor-traffic',
  POOR_CONTENT = 'poor-content',
  SUSPICIOUS_DOMAIN = 'suspicious-domain',
}

@Component({
  selector: 'app-domain-checker',
  templateUrl: './domain-checker.component.html',
  styleUrls: ['./domain-checker.component.scss'],
})
export class DomainCheckerComponent extends HandleSubscription implements OnInit {
  @Input() domain: string;
  private static readonly UPDATE_INTERVAL = 300000;//5 * 60 * 1000 s minutes
  faQuestionCircle = faQuestionCircle;
  message: string = '';
  tooltip?: string = null;
  quality: string = ''

  constructor(private publisherService: PublisherService, private http: HttpClient) {
    super();
  }

  ngOnInit(): void {
    const domainCheckSubscription = timer(0, DomainCheckerComponent.UPDATE_INTERVAL)
      .switchMap(() => this.http.get<any>(`https://gitoku.com/api/v1/data/s1/u1?url=${this.domain}`))
      .subscribe(
        (response: any) => {
          this.updateMessage(response.page_rank || 0, response.page_rank_info || PageRankInfo.UNKNOWN);
        },
        () => this.updateMessage(0, PageRankInfo.UNKNOWN)
      );

    this.subscriptions.push(domainCheckSubscription);
  }

  updateMessage(pageRank: number, pageRankInfo: string): void {
    // TODO update descriptions

    if (0 === pageRank && PageRankInfo.UNKNOWN === pageRankInfo) {
      this.message = 'In verification';
      this.tooltip = 'The domain is waiting for verification.';
      this.quality = 'medium';

      return;
    }

    if (pageRank >= 0.7) {
      this.quality = 'good';
    } else if (pageRank >= 0.3) {
      this.quality = 'medium';
    } else {
      this.quality = 'bad';
    }
    const label = Math.round(pageRank * 10);
    this.message = 0 === pageRank ? 'Banned' : `Rank: ${label}/10`;
    this.tooltip = this.tooltipByPageRankInfo(pageRankInfo);
  }

  tooltipByPageRankInfo(pageRankInfo: string): string|null {
    switch (pageRankInfo) {
      case PageRankInfo.OK:
      case PageRankInfo.UNKNOWN:
        return null;
      case PageRankInfo.HIGH_IVR:
        return 'The invalid view rate is too high. Please check your anti-bot protection.';
      case PageRankInfo.HIGH_CTR:
        return 'The click-through rate is too high. Please check your anti-bot protection.';
      case PageRankInfo.LOW_CTR:
        return 'The click-through rate is too low. Please try placing ad units in a more visible places. You can also check if you are using the most popular ad unit sizes.';
      case PageRankInfo.POOR_TRAFFIC:
        return 'Poor traffic. Please check your anti-bot protection.';
      case PageRankInfo.POOR_CONTENT:
        return 'Please make sure to have quality content on your site. We don’t allow sites that have no other content than ads.';
      case PageRankInfo.SUSPICIOUS_DOMAIN:
        return 'We don’t allow newly created domains and domains that are not present in public indexes.';
      default :
        return null;
    }
  }
}
