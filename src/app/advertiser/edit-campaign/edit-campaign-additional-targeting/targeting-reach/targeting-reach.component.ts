import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AssetTargeting } from 'models/targeting-option.model';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { Subject, Subscription } from 'rxjs';
import { HandleSubscription } from 'common/handle-subscription';
import { mapToIterable } from 'common/utilities/helpers';

@Component({
  selector: 'app-targeting-reach',
  templateUrl: './targeting-reach.component.html',
  styleUrls: ['./targeting-reach.component.scss'],
})
export class TargetingReach extends HandleSubscription implements OnChanges {
  @Input() cpm: number;
  @Input() targeting: AssetTargeting;

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
    this.targetingReachSubscription = this.advertiserService.getTargetingReach(this.targeting)
      .take(1)
      .subscribe(response => {
        if (response.occurrences && response.cpmPercentiles) {
          this.occurrencesMaximum = response.occurrences;
          this.impressionsAndCpm = mapToIterable(response.cpmPercentiles)
            .sort((a, b) => a.key === b.key ? 0 : a.key > b.key ? -1 : 1)
            .map(element => ({
              key: Math.round(element.key / 100 * this.occurrencesMaximum),
              value: Math.round(element.value / 1e9) * 1e9
            }))
            .filter((element, index, array) => index === 0 || element.value !== array[index - 1].value)
            .reverse();
        } else {
          this.occurrencesMaximum = null;
          this.impressionsAndCpm = [];
        }
        this.updateState();

        this.isLoading = false;
      }, () => this.isLoading = false);
  }

  updateState(): void {
    if (null !== this.occurrencesMaximum) {
      let impressions;
      const index = this.impressionsAndCpm.findIndex(element => element.value / 1e11 > this.cpm);

      if (-1 !== index) {
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
