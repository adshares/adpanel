import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AssetTargeting, TargetingReachResponsePercentiles } from 'models/targeting-option.model';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { Subject, Subscription } from 'rxjs';
import { HandleSubscription } from 'common/handle-subscription';

@Component({
  selector: 'app-targeting-reach',
  templateUrl: './targeting-reach.component.html',
  styleUrls: ['./targeting-reach.component.scss']
})
export class TargetingReach extends HandleSubscription implements OnChanges {
  @Input() targeting: AssetTargeting;

  private readonly REQUEST_DELAY = 1000;
  private readonly PRESENTED_REACH_THRESHOLD = 1000;

  private targetingReachSubscription: Subscription;
  private targetingChanged: Subject<void> = new Subject<void>();
  isLoading: boolean = true;
  reach: string = 'no data';
  percentiles: TargetingReachResponsePercentiles|null = null;

  constructor(
    private advertiserService: AdvertiserService,
  ) {
    super();

    const changeSubscription = this.targetingChanged
      .debounceTime(this.REQUEST_DELAY)
      .subscribe(() => this.getTargetingReach());
    this.subscriptions.push(changeSubscription);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isLoading = true;
    if (this.targetingReachSubscription) {
      this.targetingReachSubscription.unsubscribe();
    }
    this.targetingChanged.next();
  }

  getTargetingReach(): void {
    this.targetingReachSubscription = this.advertiserService.getTargetingReach(this.targeting)
      .take(1)
      .subscribe(response => {
        this.reach = response.occurrences
          ? (response.occurrences < this.PRESENTED_REACH_THRESHOLD ? `<${this.PRESENTED_REACH_THRESHOLD}` : `${response.occurrences}`)
          : 'no data';
        this.percentiles = response.percentiles ? response.percentiles : null;
        this.isLoading = false;
      }, () => this.isLoading = false);
  }
}
