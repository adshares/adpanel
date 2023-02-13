import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { first, map, startWith, take } from 'rxjs/operators';
import { AppState } from 'models/app-state.model';
import { ShowDialogOnError } from 'store/common/common.actions';
import { SaveLastEditedSite, UPDATE_SITE_FAILURE, UpdateSite } from 'store/publisher/publisher.actions';
import { cloneDeep, mapToIterable } from 'common/utilities/helpers';
import { CryptovoxelsConverter } from 'common/utilities/targeting-converter/cryptovoxels-converter';
import { DecentralandConverter } from 'common/utilities/targeting-converter/decentraland-converter';
import { siteInitialState } from 'models/initial-state/site';
import { siteStatusEnum } from 'models/enum/site.enum';
import { Site, SiteLanguage } from 'models/site.model';
import { Entry, TargetingOptionValue } from 'models/targeting-option.model';
import { User } from 'models/user.model';
import { PublisherService } from 'publisher/publisher.service';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { SessionService } from '../../../session.service';

@Component({
  selector: 'app-edit-site-basic-information',
  templateUrl: './edit-site-basic-information.component.html',
  styleUrls: ['./edit-site-basic-information.component.scss'],
})
export class EditSiteBasicInformationComponent extends HandleSubscriptionComponent implements OnInit {
  private static readonly WEBSITE_NAME_LENGTH_MAX: number = 64;
  private static readonly WEBSITE_DOMAIN_LENGTH_MAX: number = 255;
  private static readonly WEBSITE_URL_LENGTH_MAX: number = 1024;
  readonly faQuestionCircle = faQuestionCircle;
  readonly CRYPTOVOXELS = CryptovoxelsConverter.ID;
  readonly DECENTRALAND = DecentralandConverter.ID;
  readonly SETUP_VERSION = {
    AUTOMATIC: 'auto',
    MANUAL: 'manual',
  };
  siteBasicInfoForm: FormGroup;
  languages: SiteLanguage[];
  siteBasicInfoSubmitted = false;
  site: Site = cloneDeep(siteInitialState);
  createSiteMode: boolean;
  filteredOptions: Observable<object>;
  siteCategoriesOptions: TargetingOptionValue[] = [];
  selectedTargetingOptionValues: TargetingOptionValue[] = [];
  isSetCategoryMode: boolean;
  changesSaving: boolean = false;
  websiteNameLengthMax = EditSiteBasicInformationComponent.WEBSITE_NAME_LENGTH_MAX;
  websiteDomainLengthMax = EditSiteBasicInformationComponent.WEBSITE_DOMAIN_LENGTH_MAX;
  websiteUrlLengthMax = EditSiteBasicInformationComponent.WEBSITE_URL_LENGTH_MAX;
  private overwriteNameByDomain = false;
  media: Entry[];
  vendors: Entry[] = [];
  medium: string;
  vendor: string;
  isConnectedWallet: boolean = false;

  constructor(
    private action$: Actions,
    private router: Router,
    private route: ActivatedRoute,
    private publisherService: PublisherService,
    private session: SessionService,
    private store: Store<AppState>,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.media = mapToIterable(this.route.snapshot.data.media);
    const updateSiteFailureSubscription = this.action$.pipe(ofType(UPDATE_SITE_FAILURE)).subscribe(() => {
      this.changesSaving = false;
      this.store.dispatch(new ShowDialogOnError(''));
    });
    this.subscriptions.push(updateSiteFailureSubscription);
    this.createSiteMode = !!this.router.url.match('/create-site/');
    if (this.createSiteMode && this.media.length > 0) {
      this.onMediumChange(this.media[0].key);
    }
    this.getLanguages();
    this.createForm();

    this.filteredOptions = this.siteBasicInfoForm.get('primaryLanguage').valueChanges.pipe(
      startWith(''),
      map((value: string | SiteLanguage) => (typeof value === 'string' ? value : value.name)),
      map((val: string) => (val ? this.filterOptions(val) : this.languages.slice()))
    );
    this.updateWalletConnectionState();
  }

  updateSelectedTargetingOptionValues(items): void {
    this.selectedTargetingOptionValues = [...items];
  }

  getLanguages(): void {
    const languageListSubscription = this.store
      .select('state', 'publisher', 'languagesList')
      .pipe(first())
      .subscribe(languagesList => {
        this.languages = languagesList;
      });
    this.subscriptions.push(languageListSubscription);
  }

  onSubmit(): void {
    this.siteBasicInfoSubmitted = true;
    this.changesSaving = true;
    if (!this.siteBasicInfoForm.valid || !this.adjustSiteDataBeforeSave()) {
      this.changesSaving = false;
      return;
    }

    this.publisherService.validateDomain(this.site.domain, this.site.medium, this.site.vendor).subscribe(
      () => {
        this.createSiteMode ? this.saveSiteBasicInformation() : this.updateSite();
      },
      error => {
        const message = error.error && error.error.message ? error.error.message : '';
        this.store.dispatch(new ShowDialogOnError(message));
        this.changesSaving = false;
      }
    );
  }

  overwriteUrl(): void {
    const vendor = this.siteBasicInfoForm.get('vendor').value;
    let url, name;
    if (CryptovoxelsConverter.ID === vendor) {
      const value = this.siteBasicInfoForm.get('parcelId').value;
      url = new CryptovoxelsConverter().encodeValue(value);
      name = `Cryptovoxels ${value}`;
    } else if (DecentralandConverter.ID === vendor) {
      const coordinateX = this.siteBasicInfoForm.get('parcelCoordinateX').value;
      const coordinateY = this.siteBasicInfoForm.get('parcelCoordinateY').value;
      if (coordinateX === null || coordinateY === null) {
        return;
      }
      const value = `(${coordinateX}, ${coordinateY})`;
      url = new DecentralandConverter().encodeValue(value);
      name = `Decentraland ${value}`;
    }

    if (url !== undefined) {
      this.siteBasicInfoForm.get('url').setValue(`https://${url}`);
      this.onUrlBlur();
      if (this.siteBasicInfoForm.get('name').value.length === 0) {
        this.siteBasicInfoForm.get('name').setValue(name);
      }
    }
  }

  onStepBack(): void {
    this.createSiteMode
      ? this.router.navigate(['/publisher', 'dashboard'])
      : this.router.navigate(['/publisher', 'site', this.site.id]);
  }

  saveSiteBasicInformation(): void {
    this.store.dispatch(new SaveLastEditedSite(this.site));
    this.router.navigate(['/publisher', 'create-site', this.getNextPath()]);
  }

  private getNextPath(): string {
    return this.site.medium !== 'metaverse' ? 'pops-settings' : 'additional-filtering';
  }

  updateSite(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { adUnits, ...reducedSite } = this.site;
    this.store.dispatch(new UpdateSite(reducedSite));
  }

  adjustSiteDataBeforeSave(): boolean {
    let chosenLanguage = this.siteBasicInfoForm.controls['primaryLanguage'].value;

    if (typeof chosenLanguage === 'string') {
      chosenLanguage = this.getSiteInitialLanguage(chosenLanguage);
    }

    if (!chosenLanguage) {
      this.dialog.open(ErrorResponseDialogComponent, {
        data: {
          title: 'Invalid site language!',
          message: 'Fill site language field with correct data and submit',
        },
      });
      return false;
    }

    if (this.isSetCategoryMode && this.selectedTargetingOptionValues.length === 0) {
      return false;
    }

    this.site = {
      ...this.site,
      status: siteStatusEnum.REJECTED === this.site.status ? siteStatusEnum.ACTIVE : this.site.status,
      name: this.siteBasicInfoForm.controls['name'].value,
      domain: this.siteBasicInfoForm.controls['domain'].value,
      url: this.siteBasicInfoForm.controls['url'].value,
      primaryLanguage: typeof chosenLanguage === 'object' ? chosenLanguage.code : chosenLanguage,
      medium: this.siteBasicInfoForm.controls['medium'].value,
      vendor: this.siteBasicInfoForm.controls['vendor'].value,
    };

    if (this.isSetCategoryMode) {
      this.site.categories = this.selectedTargetingOptionValues.map(optionValue => optionValue.value);
    }

    return true;
  }

  onUrlFocus(): void {
    const domain = this.siteBasicInfoForm.get('domain').value;
    const name = this.siteBasicInfoForm.get('name').value;
    this.overwriteNameByDomain = name.length === 0 || name == domain;
  }

  onUrlBlur(): void {
    const url = this.siteBasicInfoForm.get('url').value;
    this.siteBasicInfoForm.get('url').setValue(this.sanitizeUrl(url));
    const domain = this.extractDomain(url);
    this.siteBasicInfoForm.get('domain').setValue(domain);
    if (this.overwriteNameByDomain) {
      this.siteBasicInfoForm.get('name').setValue(domain);
    }
    this.overwriteNameByDomain = false;
  }

  createForm(): void {
    this.siteBasicInfoForm = new FormGroup({
      name: new FormControl(siteInitialState.name, [
        Validators.required,
        Validators.maxLength(EditSiteBasicInformationComponent.WEBSITE_NAME_LENGTH_MAX),
      ]),
      domain: new FormControl(siteInitialState.domain, [
        Validators.required,
        Validators.maxLength(EditSiteBasicInformationComponent.WEBSITE_DOMAIN_LENGTH_MAX),
        Validators.pattern(/^(?![.]).+\..+$/),
      ]),
      url: new FormControl(siteInitialState.url, [
        Validators.required,
        Validators.maxLength(EditSiteBasicInformationComponent.WEBSITE_URL_LENGTH_MAX),
        Validators.pattern(/^https?:\/\/(?![.])[^\/?#]+\.[^\/?#]+$/i),
      ]),
      primaryLanguage: new FormControl(siteInitialState.primaryLanguage, Validators.required),
      medium: new FormControl({
        value: siteInitialState.medium,
        disabled: !this.createSiteMode,
      }),
      vendor: new FormControl({
        value: siteInitialState.vendor,
        disabled: !this.createSiteMode,
      }),
      setupVersionControl: new FormControl(this.SETUP_VERSION.MANUAL),
    });
    this.siteBasicInfoForm.get('medium').valueChanges.subscribe(value => (this.medium = value));
    this.getFormDataFromStore();
  }

  getFormDataFromStore(): void {
    const lastEditedSiteSubscription = this.store
      .select('state', 'publisher', 'lastEditedSite')
      .pipe(take(1))
      .subscribe(lastEditedSite => {
        this.site = cloneDeep(lastEditedSite);
        this.site.primaryLanguage = lastEditedSite.primaryLanguage
          ? this.getSiteInitialLanguage(lastEditedSite.primaryLanguage)
          : this.getSiteInitialLanguage();
        this.siteBasicInfoForm.patchValue(this.site);
        this.onMediumChange(this.site.medium);
        if (!this.createSiteMode) {
          this.vendor = this.site.vendor;
          this.updateFormGroupOnVendorChange(this.vendor);
          if (this.site.medium === 'metaverse') {
            if (CryptovoxelsConverter.ID === this.vendor) {
              const value = new CryptovoxelsConverter().decodeValue(this.site.url.slice('https://'.length));
              this.siteBasicInfoForm.get('parcelId').setValue(value);
            } else if (DecentralandConverter.ID === this.vendor) {
              const value = new DecentralandConverter().decodeValue(this.site.url.slice('https://'.length));
              const coordinates = value.slice(1, value.length - 1).split(', ');
              this.siteBasicInfoForm.get('parcelCoordinateX').setValue(coordinates[0]);
              this.siteBasicInfoForm.get('parcelCoordinateY').setValue(coordinates[1]);
            }
          }
        }
      });
    this.subscriptions.push(lastEditedSiteSubscription);
  }

  getSiteInitialLanguage(languageCode?: string | SiteLanguage): SiteLanguage {
    let data;
    if (languageCode) {
      data = typeof languageCode === 'string' ? languageCode : languageCode.code;
    } else {
      data = navigator.language.split('-')[0];
    }

    data = data.toLowerCase();

    return this.languages.find(lang => lang.code.toLowerCase() === data || lang.name.toLowerCase() === data);
  }

  displayOption(language?): string {
    return language ? language.name : '';
  }

  filterOptions(val: string): object[] {
    const filterValue = val.toLowerCase();
    return this.languages.filter(
      option => option.name.toLowerCase().includes(filterValue) || option.code.toLowerCase().includes(filterValue)
    );
  }

  extractDomain(url: string): string {
    let domain = url.toLowerCase();
    //remove protocol, user info and www subdomain
    domain = domain.replace(/^(?:[a-z0-9+.-]+:\/\/)?(?:\/\/)?(?:.*@)?(?:www\.)?/i, '');
    // remove port number, path, query string and fragment
    domain = domain.replace(/(?::.*)?(?:\/.*)?(?:\?.*)?(?:#.*)?$/i, '');

    return domain;
  }

  sanitizeUrl(url: string): string {
    let sanitizedUrl = url.toLowerCase();
    // remove path, query string and fragment
    sanitizedUrl = sanitizedUrl.replace(/^(https?:\/\/[^\/?#]*)(?:\/.*)?(?:\?.*)?(?:#.*)?$/i, '$1');
    // remove port
    sanitizedUrl = sanitizedUrl.replace(/:\d+$/, '');
    // remove authentication
    sanitizedUrl = sanitizedUrl.replace(/^(https?:\/\/)(?:.*@)?/i, '$1');

    return sanitizedUrl;
  }

  loadSiteCategories(medium: string, vendor: string | null = null): void {
    if (!this.createSiteMode) {
      return;
    }
    const siteCategoriesSubscription = this.publisherService
      .siteCategoriesOptions(medium, vendor)
      .subscribe(options => {
        this.siteCategoriesOptions = options;
        this.isSetCategoryMode = options.length > 0;
      });
    this.subscriptions.push(siteCategoriesSubscription);
  }

  onMediumChange(medium: string): void {
    const subscription = this.publisherService
      .getMediumVendors(medium)
      .pipe(take(1))
      .subscribe(vendors => {
        this.vendors = mapToIterable(vendors);
        if (this.createSiteMode) {
          this.setupVersionControl.setValue(
            medium === 'metaverse' ? this.SETUP_VERSION.AUTOMATIC : this.SETUP_VERSION.MANUAL
          );
          const vendor = this.vendors.length > 0 ? this.vendors[0].key : null;
          this.updateFormGroupOnVendorChange(vendor);
          this.vendor = vendor;
          this.siteBasicInfoForm.get('vendor').patchValue(vendor);
          this.loadSiteCategories(medium, vendor);
        }
      });
    this.subscriptions.push(subscription);
  }

  onVendorChange(vendor: string): void {
    this.updateFormGroupOnVendorChange(vendor);
    this.vendor = vendor;
    this.loadSiteCategories(this.siteBasicInfoForm.controls['medium'].value, vendor);
  }

  updateFormGroupOnVendorChange(vendor: string | null): void {
    this.siteBasicInfoForm.removeControl('parcelId');
    this.siteBasicInfoForm.removeControl('parcelCoordinateX');
    this.siteBasicInfoForm.removeControl('parcelCoordinateY');

    if (CryptovoxelsConverter.ID === vendor) {
      this.siteBasicInfoForm.addControl('parcelId', new FormControl(null, Validators.required));
    } else if (DecentralandConverter.ID === vendor) {
      this.siteBasicInfoForm.addControl('parcelCoordinateX', new FormControl(null, Validators.required));
      this.siteBasicInfoForm.addControl('parcelCoordinateY', new FormControl(null, Validators.required));
    }
  }

  get hasParcelCoordinateError(): boolean {
    const coordinateX = this.siteBasicInfoForm.get('parcelCoordinateX');
    const coordinateY = this.siteBasicInfoForm.get('parcelCoordinateY');
    return (
      (coordinateX.invalid && (coordinateX.touched || coordinateX.dirty)) ||
      (coordinateY.invalid && (coordinateY.touched || coordinateY.dirty))
    );
  }

  get hasParcelIdError(): boolean {
    const parcelId = this.siteBasicInfoForm.get('parcelId');
    return parcelId.invalid && (parcelId.touched || parcelId.dirty);
  }

  get setupVersionControl(): AbstractControl {
    return this.siteBasicInfoForm.get('setupVersionControl');
  }

  get isTaxonomy(): boolean {
    return this.media.length > 0;
  }

  private updateWalletConnectionState(): void {
    const userSubscription = this.store.select('state', 'user', 'data').subscribe((user: User) => {
      this.isConnectedWallet =
        user.isConfirmed && user.adserverWallet.walletAddress !== null && user.adserverWallet.walletNetwork !== null;
    });
    this.subscriptions.push(userSubscription);
  }
}
