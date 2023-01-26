import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Ad } from 'models/campaign.model';
import { AssetTargeting } from 'models/targeting-option.model';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { Subject, Subscription } from 'rxjs';
import { take, debounceTime } from 'rxjs/operators';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { mapToIterable } from 'common/utilities/helpers';

@Component({
  selector: 'app-targeting-reach',
  templateUrl: './targeting-reach.component.html',
  styleUrls: ['./targeting-reach.component.scss'],
})
export class TargetingReachComponent extends HandleSubscriptionComponent implements OnChanges {
  @Input() ads: Ad[];
  @Input() autoCpm: boolean = false;
  @Input() cpm: number = 0;
  @Input() targeting: AssetTargeting;
  @Input() vendor: string | null = null;

  private readonly REQUEST_DELAY = 1000;
  private readonly PRESENTED_REACH_THRESHOLD = 1000;

  private targetingReachSubscription: Subscription;
  private targetingChanged: Subject<void> = new Subject<void>();
  isLoading: boolean = true;
  occurrencesMaximum: number | null = null;
  reach: string | null = null;
  impressionsAndCpm: any[] = [];
  nextStepImpressions: number;
  nextStepCpm: number;
  sizes: string[] = [];

  constructor(private advertiserService: AdvertiserService) {
    super();

    const changeSubscription = this.targetingChanged
      .pipe(debounceTime(this.REQUEST_DELAY))
      .subscribe(() => this.getTargetingReach());
    this.subscriptions.push(changeSubscription);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ads) {
      this.sizes = changes.ads.currentValue.map(element => element.creativeSize);
    }
    if (changes.targeting) {
      this.isLoading = true;
      if (this.targetingReachSubscription) {
        this.targetingReachSubscription.unsubscribe();
      }
      this.targetingChanged.next();

      return;
    }

    this.updateState();
  }

  getTargetingReach(): void {
    this.targetingReachSubscription = this.advertiserService
      .getTargetingReach(this.sizes, this.targeting, this.vendor)
      .pipe(take(1))
      .subscribe(
        response => {
          if (response.occurrences && response.cpmPercentiles) {
            this.occurrencesMaximum = response.occurrences;
            this.impressionsAndCpm = mapToIterable(response.cpmPercentiles)
              .sort((a, b) => parseInt(b.key) - parseInt(a.key))
              .map(element => ({
                key: Math.round((element.key / 100) * this.occurrencesMaximum),
                value: Math.round(element.value / 1e9) * 1e9,
              }))
              .filter((element, index, array) => index === 0 || element.value !== array[index - 1].value)
              .reverse();
          } else {
            this.occurrencesMaximum = null;
            this.impressionsAndCpm = [];
          }
          this.updateState();

          this.isLoading = false;
        },
        () => (this.isLoading = false)
      );
  }

  updateState(): void {
    if (null !== this.occurrencesMaximum) {
      let impressions;
      const index = this.impressionsAndCpm.findIndex(
        element => element.key >= this.PRESENTED_REACH_THRESHOLD && element.value / 1e11 > this.cpm
      );

      if (index !== -1 && !this.autoCpm) {
        impressions = this.impressionsAndCpm[index].key;
        this.nextStepCpm = this.impressionsAndCpm[index].value;
        if (this.impressionsAndCpm.length - 1 === index) {
          this.nextStepImpressions = this.occurrencesMaximum;
        } else {
          this.nextStepImpressions = this.impressionsAndCpm[index + 1].key;
        }
      } else {
        impressions = this.occurrencesMaximum;
        this.nextStepCpm = 0;
      }

      if (impressions < this.PRESENTED_REACH_THRESHOLD) {
        this.reach = `${this.PRESENTED_REACH_THRESHOLD}`;
      } else {
        this.reach = `${impressions}`;
      }
    } else {
      this.reach = null;
      this.nextStepCpm = 0;
    }
  }
}
