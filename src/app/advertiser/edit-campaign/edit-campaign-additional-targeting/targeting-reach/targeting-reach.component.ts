import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AssetTargeting } from 'models/targeting-option.model';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { Subject, Subscription } from 'rxjs';
import { HandleSubscription } from 'common/handle-subscription';
import { formatMoney, mapToIterable } from 'common/utilities/helpers';

@Component({
  selector: 'app-targeting-reach',
  templateUrl: './targeting-reach.component.html',
  styleUrls: ['./targeting-reach.component.scss'],
})
export class TargetingReach extends HandleSubscription implements OnChanges {
  @Input() targeting: AssetTargeting;

  private readonly REQUEST_DELAY = 1000;
  private readonly PRESENTED_REACH_THRESHOLD = 1000;

  private targetingReachSubscription: Subscription;
  private targetingChanged: Subject<void> = new Subject<void>();
  isLoading: boolean = true;
  reach: string = 'no data';
  impressionsAndCpm: any[] = [];

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
        let tmpImpressionsAndCpm = [];
        if (response.occurrences) {
          const occurrences = response.occurrences;
          if (occurrences < this.PRESENTED_REACH_THRESHOLD) {
            this.reach = `<${this.PRESENTED_REACH_THRESHOLD}`;
          } else {
            this.reach = `${occurrences}`;

            if (response.percentiles) {
              tmpImpressionsAndCpm = mapToIterable(response.percentiles)
                .sort((a, b) => a.key === b.key ? 0 : a.key > b.key ? -1 : 1)
                .filter((element, index, array) => index === 0 || formatMoney(element.value, 2) !== formatMoney(array[index - 1].value, 2))
                .map(element => ({key: element.key / 100 * occurrences, value: element.value}))
                .reverse();
            }
          }
        } else {
          this.reach = 'no data';
        }

        this.impressionsAndCpm = tmpImpressionsAndCpm;
        this.isLoading = false;
      }, () => this.isLoading = false);
  }
}
