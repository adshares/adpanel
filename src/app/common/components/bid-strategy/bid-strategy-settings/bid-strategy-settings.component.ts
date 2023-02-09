import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { forkJoin as observableForkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppState } from 'models/app-state.model';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { ShowDialogOnError, ShowSuccessSnackbar } from 'store/common/common.actions';
import { BidStrategy, BidStrategyDetail, BidStrategyRequest } from 'models/campaign.model';
import { Entry, TargetingOption, TargetingOptionValue } from 'models/targeting-option.model';
import { cloneDeep, downloadReport, mapToIterable } from 'common/utilities/helpers';
import { DELETE_SUCCESS, SAVE_SUCCESS } from 'common/utilities/messages';
import { SessionService } from '../../../../session.service';
import { BidStrategyService } from 'common/bid-strategy.service';
import { HTTP_INTERNAL_SERVER_ERROR, HTTP_NOT_FOUND } from 'common/utilities/codes';
import { faPlus, faDownload, faUpload, faSave } from '@fortawesome/free-solid-svg-icons';

interface BidStrategyComponentEntry {
  key: string;
  label: string;
  value: number;
}

@Component({
  selector: 'app-bid-strategy-settings',
  templateUrl: './bid-strategy-settings.component.html',
  styleUrls: ['./bid-strategy-settings.component.scss'],
})
export class BidStrategySettingsComponent extends HandleSubscriptionComponent implements OnInit {
  @Input() medium: string;
  @Input() vendor: string | null;
  readonly PREDEFINED_RANKS = [100, 80, 60, 40, 20, 0];
  readonly MAXIMAL_SPREADSHEET_SIZE_IN_BYTES = 100000;
  readonly SPREADSHEET_MIME_TYPES: string[] = [
    'application/octet-stream',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
  ];
  availableEntries: BidStrategyComponentEntry[] = [];
  entries: BidStrategyComponentEntry[] = [];
  bidStrategies: BidStrategy[] = [];
  bidStrategyUuidSelected: string | null = null;
  bidStrategyNameSelected: string = '';
  isLoading: boolean = true;
  bidStrategiesOptionsAreMissing: boolean = false;
  isAdmin: boolean = false;
  isDownloadInProgress: boolean = false;
  isUploadInProgress: boolean = false;
  media: Entry[] = [];
  vendors: Entry[] = [];
  faPlus = faPlus;
  faDownload = faDownload;
  faUpload = faUpload;
  faSave = faSave;

  constructor(
    private bidStrategyService: BidStrategyService,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit(): void {
    this.isAdmin = this.sessionService.isAdmin();
    this.media = mapToIterable(this.route.snapshot.data.media);
    if (this.medium === undefined && this.media.length > 0) {
      this.onMediumChange(this.media[0].key);
    } else {
      this.updateBidStrategiesList();
    }
  }

  private updateBidStrategiesList(): void {
    const subscription = observableForkJoin([
      this.bidStrategyService.getTargetingCriteria(this.medium, this.vendor),
      this.bidStrategyService.getBidStrategies(this.medium, this.vendor),
    ]).subscribe(
      (responses: [TargetingOption[], BidStrategy[]]) => {
        this.handleFetchedTargetingOptions(responses[0]);
        this.handleFetchedBidStrategies(responses[1]);
      },
      error => {
        const status = error.status ? error.status : 0;
        if (status === HTTP_INTERNAL_SERVER_ERROR) {
          return;
        }
        if (status === HTTP_NOT_FOUND) {
          this.bidStrategiesOptionsAreMissing = true;
          this.store.dispatch(
            new ShowDialogOnError('Bid strategies options are not available. Please contact support')
          );
        } else {
          this.store.dispatch(new ShowDialogOnError(`Reload the page to load data. Error code (${status})`));
        }
      }
    );
    this.subscriptions.push(subscription);
  }

  private handleFetchedTargetingOptions(targetingOptions: TargetingOption[]): void {
    this.availableEntries = this.processTargetingOptions(targetingOptions);
  }

  private processTargetingOptions(
    options: TargetingOption[],
    parentKey: string = '',
    parentLabel: string = ''
  ): BidStrategyComponentEntry[] {
    const result = [];

    options.forEach(option => {
      const key = '' === parentKey ? option.key : `${parentKey}:${option.key}`;
      const label = '' === parentLabel ? option.label : `${parentLabel}/${option.label}`;

      if (option.children) {
        result.push(...this.processTargetingOptions(option.children, key, label));
      }
      if (option.values) {
        result.push(...this.processTargetingOptionValues(option.values, key, label));
      }
    });

    return result;
  }

  private processTargetingOptionValues(
    optionValues: TargetingOptionValue[],
    parentKey: string,
    parentLabel: string
  ): BidStrategyComponentEntry[] {
    const result = [];

    optionValues.forEach(optionValue => {
      const key = `${parentKey}:${optionValue.value}`;
      const label = `${parentLabel}/${optionValue.label}`;

      result.push({
        key: key,
        label: label,
        value: 100,
      });

      if (optionValue.values) {
        result.push(...this.processTargetingOptionValues(optionValue.values, parentKey, label));
      }
    });

    return result;
  }

  private handleFetchedBidStrategies(bidStrategies: BidStrategy[]): void {
    this.bidStrategies = bidStrategies;
    this.bidStrategyUuidSelected = bidStrategies.length > 0 ? bidStrategies[0].uuid : null;
    if (this.bidStrategyUuidSelected) {
      this.onBidStrategySelect();
    } else {
      this.addNewBidStrategy();
      this.isLoading = false;
    }
  }

  onBidStrategySelect(): void {
    this.isLoading = true;

    const temporaryEntries = cloneDeep(this.availableEntries);
    const bidStrategy = this.bidStrategies.find(item => this.bidStrategyUuidSelected === item.uuid);
    if (bidStrategy) {
      bidStrategy.details.forEach(detail => {
        const index = temporaryEntries.findIndex(entry => entry.key === detail.category);
        if (index >= 0) {
          temporaryEntries[index].value = Math.round(detail.rank * 100);
        }
      });

      this.bidStrategyNameSelected = bidStrategy.name;
    }
    this.entries = temporaryEntries;
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

    this.bidStrategyService.putBidStrategy(bidStrategy, this.medium, this.vendor).subscribe(
      response => {
        this.store.dispatch(new ShowSuccessSnackbar(SAVE_SUCCESS));

        this.bidStrategies.push({
          ...bidStrategy,
          uuid: response.uuid,
        });

        this.bidStrategyUuidSelected = response.uuid;
        this.bidStrategyNameSelected = bidStrategy.name;
      },
      error => this.handleError(error)
    );
  }

  update(): void {
    const uuid = this.bidStrategyUuidSelected;
    const bidStrategy = this.getBidStrategyFromForm();

    this.bidStrategyService.patchBidStrategy(uuid, bidStrategy).subscribe(
      () => {
        this.store.dispatch(new ShowSuccessSnackbar(SAVE_SUCCESS));

        const definedBidStrategy = this.bidStrategies.find(item => this.bidStrategyUuidSelected === item.uuid);
        definedBidStrategy.name = bidStrategy.name;
        definedBidStrategy.details = bidStrategy.details;
      },
      error => {
        const status = error.status ? error.status : 0;
        this.store.dispatch(
          new ShowDialogOnError(`An error occurred. Error code (${status}). Please, try again later.`)
        );
      }
    );
  }

  private collectBidStrategyDetails(): BidStrategyDetail[] {
    const details = [];
    this.entries.forEach(entry => {
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

    this.bidStrategyService
      .patchBidStrategyUuidDefault(this.bidStrategyUuidSelected, this.medium, this.vendor)
      .subscribe(
        () => {
          this.store.dispatch(new ShowSuccessSnackbar(SAVE_SUCCESS));
        },
        error => {
          const status = error.status ? error.status : 0;
          this.store.dispatch(
            new ShowDialogOnError(`An error occurred. Error code (${status}). Please, try again later.`)
          );
        }
      );
  }

  deleteBidStrategy(): void {
    if (!this.bidStrategyUuidSelected) {
      return;
    }

    this.bidStrategyService.deleteBidStrategy(this.bidStrategyUuidSelected).subscribe(
      () => {
        this.store.dispatch(new ShowSuccessSnackbar(DELETE_SUCCESS));
        const previousBidStrategyUuidSelected = this.bidStrategyUuidSelected;
        this.bidStrategyUuidSelected = null;
        this.handleFetchedBidStrategies(
          this.bidStrategies.filter(bidStrategy => previousBidStrategyUuidSelected !== bidStrategy.uuid)
        );
      },
      error => this.handleError(error)
    );
  }

  private handleError(error): void {
    let payload;
    if (error.error && error.error.message) {
      payload = error.error.message;
    } else {
      const status = error.status ? error.status : 0;
      payload = `An error occurred. Error code (${status}). Please, try again later.`;
    }

    this.store.dispatch(new ShowDialogOnError(payload));
  }

  downloadSpreadsheet(): void {
    if (this.isDownloadInProgress || null === this.bidStrategyUuidSelected) {
      return;
    }
    this.isDownloadInProgress = true;

    this.bidStrategyService
      .getBidStrategySpreadsheet(this.bidStrategyUuidSelected)
      .pipe(take(1))
      .subscribe(
        response => {
          downloadReport(response);
          this.isDownloadInProgress = false;
        },
        () => {
          this.store.dispatch(
            new ShowDialogOnError('File cannot be downloaded at this moment. Please try again later.')
          );
          this.isDownloadInProgress = false;
        }
      );
  }

  uploadSpreadsheet(event): void {
    if (this.isUploadInProgress || null === this.bidStrategyUuidSelected) {
      return;
    }
    const file = event.target.files[0];
    if (!this.SPREADSHEET_MIME_TYPES.includes(file.type)) {
      this.store.dispatch(new ShowDialogOnError(`Unsupported mime type ('${file.type}').`));
      return;
    }
    if (file.size > this.MAXIMAL_SPREADSHEET_SIZE_IN_BYTES) {
      this.store.dispatch(
        new ShowDialogOnError(`File size exceeds maximum of ${this.MAXIMAL_SPREADSHEET_SIZE_IN_BYTES / 1000}kB.`)
      );
      return;
    }

    this.sendFile(file);
  }

  private sendFile(file: File): void {
    this.isUploadInProgress = true;
    const data = new FormData();
    data.append('file', file, file.name);
    const sendFileSubscription = this.bidStrategyService
      .postBidStrategySpreadsheet(this.bidStrategyUuidSelected, data)
      .subscribe(
        () => {
          this.isUploadInProgress = false;
          this.isLoading = true;
          this.bidStrategyService.getBidStrategies(this.medium, this.vendor).subscribe(
            response => this.handleFetchedBidStrategies(response),
            error => {
              const status = error.status ? error.status : 0;
              this.store.dispatch(new ShowDialogOnError(`Reload the page to load data. Error code (${status})`));
            }
          );
        },
        () => {
          this.store.dispatch(new ShowDialogOnError('File cannot be uploaded at this moment. Please try again later.'));
          this.isUploadInProgress = false;
        }
      );
    this.subscriptions.push(sendFileSubscription);
  }

  onMediumChange(medium: string): void {
    this.isLoading = true;
    this.vendors = [];
    this.medium = medium;
    const subscription = this.bidStrategyService
      .getMediumVendors(medium)
      .pipe(take(1))
      .subscribe(vendors => {
        this.vendors = mapToIterable(vendors);
        const vendor = this.vendors.length > 0 ? this.vendors[0].key : null;
        this.onVendorChange(vendor);
      });
    this.subscriptions.push(subscription);
  }

  onVendorChange(vendor: string | null): void {
    this.isLoading = true;
    this.vendor = vendor;
    this.updateBidStrategiesList();
  }

  get isTaxonomy(): boolean {
    return this.media.length > 0;
  }
}
