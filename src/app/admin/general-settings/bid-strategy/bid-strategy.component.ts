import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'models/app-state.model';
import { HandleSubscription } from 'common/handle-subscription';
import { AdminService } from 'admin/admin.service';
import { ShowDialogOnError, ShowSuccessSnackbar } from 'store/common/common.actions';
import { BidStrategy, BidStrategyDetail, BidStrategyRequest } from 'models/campaign.model';
import { TargetingOption } from 'models/targeting-option.model';
import { cloneDeep } from 'common/utilities/helpers';
import { SAVE_SUCCESS } from 'common/utilities/messages';
import { SessionService } from '../../../session.service';

@Component({
  selector: 'app-bid-strategy',
  templateUrl: './bid-strategy.component.html',
  styleUrls: ['./bid-strategy.component.scss'],
})
export class BidStrategyComponent extends HandleSubscription implements OnInit {
  readonly PREDEFINED_RANKS = [100, 80, 60, 40, 20, 0];
  availableEntries: { key: string, label: string, value: number }[] = [];
  entries: { key: string, label: string, value: number }[] = [];
  bidStrategies: BidStrategy[] = [];
  bidStrategyUuidSelected: string | null = null;
  bidStrategyNameSelected: string = '';
  isLoading: boolean = true;
  isAdmin: boolean = false;

  constructor(
    private adminService: AdminService,
    private sessionService: SessionService,
    private store: Store<AppState>,
  ) {
    super();
  }

  ngOnInit() {
    this.isAdmin = this.sessionService.isAdmin();

    Observable.forkJoin(
      this.adminService.getTargetingCriteria(),
      this.adminService.getBidStrategies(),
    ).subscribe(
      (responses: [TargetingOption[], BidStrategy[]]) => {
        this.handleFetchedTargetingOptions(responses[0]);
        this.handleFetchedBidStrategies(responses[1]);
      },
      (error) => {
        const status = error.status ? error.status : 0;
        this.store.dispatch(new ShowDialogOnError(`Reload the page to load data. Error code (${status})`));
      });
  }

  private handleFetchedTargetingOptions(targetingOptions: TargetingOption[]): void {
    const temporaryEntries = [];

    targetingOptions.forEach((targetingOption) => {
      const groupLabel = targetingOption.label;
      const groupKey = targetingOption.key;
      targetingOption.children.forEach((child) => {
        const childLabel = child.label;
        const childKey = child.key;
        if (child.values) {
          child.values.forEach((value) => {
            const valueLabel = value.label;
            const valueKey = value.value;

            temporaryEntries.push({
              label: `${groupLabel}/${childLabel}/${valueLabel}`,
              key: `${groupKey}:${childKey}:${valueKey}`,
              value: 100,
            });
          });
        }
      });
    });

    this.availableEntries = temporaryEntries;
  }

  private handleFetchedBidStrategies(bidStrategies: BidStrategy[]): void {
    this.bidStrategies = bidStrategies;
    this.bidStrategyUuidSelected = bidStrategies.length > 0 ? bidStrategies[0].uuid : null;
    if (this.bidStrategyUuidSelected) {
      this.onBidStrategySelect();
    }
  }

  onBidStrategySelect(): void {
    this.isLoading = true;

    const bidStrategy = this.bidStrategies.find((bidStrategy) => this.bidStrategyUuidSelected === bidStrategy.uuid);
    if (bidStrategy) {
      const temporaryEntries = cloneDeep(this.availableEntries);

      bidStrategy.details.forEach((detail) => {
        const index = temporaryEntries.findIndex((entry) => entry.key === detail.category);
        if (index >= 0) {
          temporaryEntries[index].value = detail.rank * 100;
        }
      });

      this.bidStrategyNameSelected = bidStrategy.name;
      this.entries = temporaryEntries;
    }

    this.isLoading = false;
  }

  addNewBidStrategy(): void {
    this.bidStrategyUuidSelected = null;
    this.bidStrategyNameSelected = '';
    this.entries = cloneDeep(this.availableEntries);
  }

  private getBidStrategyFromForm(): BidStrategyRequest {
    return {
      name: this.bidStrategyNameSelected,
      details: this.collectBidStrategyDetails(),
    };
  }

  saveOrUpdate(): void {
    this.bidStrategyUuidSelected ? this.update() : this.save();
  }

  save(): void {
    const bidStrategy = this.getBidStrategyFromForm();

    this.adminService.putBidStrategies(bidStrategy).subscribe(
      (response) => {
        this.store.dispatch(new ShowSuccessSnackbar(SAVE_SUCCESS));

        this.bidStrategies.push({
          ...bidStrategy,
          uuid: response.uuid,
        });

        this.bidStrategyUuidSelected = response.uuid;
        this.bidStrategyNameSelected = bidStrategy.name;
      },
      (error) => {
        const status = error.status ? error.status : 0;
        this.store.dispatch(new ShowDialogOnError(`An error occurred. Error code (${status}). Please, try again later.`));
      },
    );
  }

  update(): void {
    const uuid = this.bidStrategyUuidSelected;
    const bidStrategy = this.getBidStrategyFromForm();

    this.adminService.patchBidStrategies(uuid, bidStrategy).subscribe(
      () => {
        this.store.dispatch(new ShowSuccessSnackbar(SAVE_SUCCESS));

        const definedBidStrategy = this.bidStrategies.find((bidStrategy) => this.bidStrategyUuidSelected === bidStrategy.uuid);
        definedBidStrategy.name = bidStrategy.name;
        definedBidStrategy.details = bidStrategy.details;
      },
      (error) => {
        const status = error.status ? error.status : 0;
        this.store.dispatch(new ShowDialogOnError(`An error occurred. Error code (${status}). Please, try again later.`));
      },
    );
  }

  private collectBidStrategyDetails(): BidStrategyDetail[] {
    const details = [];
    this.entries.forEach((entry) => {
      if (entry.value != 100) {
        details.push({
          category: entry.key,
          rank: entry.value / 100,
        });
      }
    });
    return details;
  }

  setDefaultBidStrategy(): void {
    if (!this.bidStrategyUuidSelected) {
      return;
    }

    this.adminService.putBidStrategyUuidDefault(this.bidStrategyUuidSelected).subscribe(
      () => {
        this.store.dispatch(new ShowSuccessSnackbar(SAVE_SUCCESS));
      },
      (error) => {
        const status = error.status ? error.status : 0;
        this.store.dispatch(new ShowDialogOnError(`An error occurred. Error code (${status}). Please, try again later.`));
      },
    );
  }
}
