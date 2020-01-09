import {Component, Input, OnInit} from '@angular/core';
import {faQuestionCircle} from '@fortawesome/free-solid-svg-icons';
import {HttpClient} from '@angular/common/http';
import {HandleSubscription} from 'common/handle-subscription';
import {PublisherService} from 'publisher/publisher.service';
import {timer} from 'rxjs/observable/timer';

enum PageRankInfo {
  OK = 'ok',
  UNKNOWN = 'unknown',
  HIGH_IVR = 'high-ivr',
  HIGH_CTR = 'high-ctr',
  LOW_CTR = 'low-ctr',
  POOR_TRAFFIC = 'poor-traffic',
  POOR_CONTENT = 'poor-content',
  SUSPICIOUS_DOMAIN = 'suspicious-domain',
  NOT_WORKING = 'not-working',
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
      .switchMap(() => this.http.get<any>('https://gitoku.com/api/v1/domain/' + encodeURIComponent(this.domain)))
      .subscribe(
        (response: any) => {
          this.updateMessage(response.rank || 0, response.info || PageRankInfo.UNKNOWN);
        },
        () => this.updateMessage(0, PageRankInfo.UNKNOWN)
      );

    this.subscriptions.push(domainCheckSubscription);
  }

  updateMessage(pageRank: number, pageRankInfo: string): void {

    if (0 === pageRank && PageRankInfo.UNKNOWN === pageRankInfo) {
      this.message = 'In verification';
      this.tooltip = 'The domain is waiting for verification.';
      this.quality = 'medium';

      return;
    }

    this.quality = this.qualityByPageRank(pageRank);
    this.message = this.messageByPageRank(pageRank);
    this.tooltip = this.tooltipByPageRank(pageRank, pageRankInfo);
  }

  qualityByPageRank(pageRank: number): string {
    let quality = '';
    if (pageRank >= 0.7) {
      quality = 'great';
    } else if (pageRank >= 0.3) {
      quality = 'good';
    } else if (pageRank > 0  || pageRank == -1) {
      quality = 'medium';
    } else {
      quality = 'bad';
    }

    return quality;
  }

  messageByPageRank(pageRank: number): string {
    let message = '';
    if (pageRank == -1) {
      message = 'CPA only';
    } else if (pageRank <= 0) {
      message = 'Banned';
    } else {
      const label = Math.round(pageRank * 10);
      message = `Rank: ${label}/10`;
    }

    return message;
  }

  tooltipByPageRank(pageRank: number, pageRankInfo: string): string | null {
    let info = null;

    if (pageRank == -1) {
      info = 'Your site has been approved for CPA campaigns only. ';
    } else if (pageRank <= 0) {
      info = 'Your site has been banned. ';
    } else if (pageRankInfo != PageRankInfo.OK) {
      info = `Your site has been conditionally approved. `;
    }

    switch (pageRankInfo) {
      case PageRankInfo.HIGH_IVR:
        info += 'The invalid view rate is too high. Please check your anti-bot protection.';
        break;
      case PageRankInfo.HIGH_CTR:
        info += 'The click-through rate is too high. Please check your anti-bot protection.';
        break;
      case PageRankInfo.LOW_CTR:
        info += 'The click-through rate is too low. Please try placing ad units in a more visible places. You can also check if you are using the most popular ad unit sizes.';
        break;
      case PageRankInfo.POOR_TRAFFIC:
        info += 'Poor traffic. Please check your anti-bot protection.';
        break;
      case PageRankInfo.POOR_CONTENT:
        info += 'Please make sure to have quality content on your site. We don’t allow sites that have no other content than ads.';
        break;
      case PageRankInfo.SUSPICIOUS_DOMAIN:
        info += 'We don’t allow newly created domains and domains that are not present in public indexes.';
        break;
      case PageRankInfo.NOT_WORKING:
        info += 'The site is not responding or reports an error.';
        break;
    }

    return info;
  }
}
