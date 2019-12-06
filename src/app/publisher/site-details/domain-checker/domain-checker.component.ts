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

  constructor(private publisherService: PublisherService, private http: HttpClient) {
    super();
  }

  ngOnInit(): void {
    const domainCheckSubscription = timer(0, DomainCheckerComponent.UPDATE_INTERVAL)
      .switchMap(() => this.http.get<any>(`https://gitoku.com/api/v1/data/s1/u1?url=${this.domain}`))
      .subscribe(
        (response: any) => {
          const pageRank = Math.round((response.page_rank || 0) * 10);
          this.updateMessage(pageRank, response.page_rank_info || PageRankInfo.UNKNOWN);
        },
        () => this.updateMessage(0, PageRankInfo.UNKNOWN)
      );

    this.subscriptions.push(domainCheckSubscription);
  }

  updateMessage(pageRank: number, pageRankInfo: string): void {
    // TODO update descriptions
    if (0 === pageRank && PageRankInfo.UNKNOWN === pageRankInfo) {
      this.message = 'Verification';
      this.tooltip = 'Domain waits for check';

      return;
    }

    this.message = 0 === pageRank ? 'Banned' : `${pageRank}/10`;
    this.tooltip = this.tooltipByPageRankInfo(pageRankInfo);
  }

  tooltipByPageRankInfo(pageRankInfo: string): string|null {
    // TODO update descriptions
    switch (pageRankInfo) {
      case PageRankInfo.OK:
      case PageRankInfo.UNKNOWN:
        return null;
      case PageRankInfo.HIGH_IVR:
        return 'high invalid view rate';
      case PageRankInfo.HIGH_CTR:
        return 'high click through rate';
      case PageRankInfo.POOR_TRAFFIC:
        return 'bad traffic';
      case PageRankInfo.POOR_CONTENT:
        return 'low quality content';
      case PageRankInfo.SUSPICIOUS_DOMAIN:
        return 'untrusted domain';
      default :
        return null;
    }
  }
}
