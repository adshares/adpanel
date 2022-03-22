import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppState } from 'models/app-state.model';
import { ShowDialogOnError } from 'store/common/common.actions';
import { SaveLastEditedSite, UPDATE_SITE_FAILURE, UpdateSite } from 'store/publisher/publisher.actions';
import { cloneDeep, mapToIterable } from 'common/utilities/helpers';
import { ADD_UNIT_CRYPTOVOXELS, ADD_UNIT_DECENTRALAND } from 'models/enum/link.enum';
import { siteInitialState } from 'models/initial-state/site';
import { Site, SiteLanguage } from 'models/site.model';
import { Entry, TargetingOptionValue } from 'models/targeting-option.model';
import {
  SiteCodeCryptovoxelsDialogComponent
} from 'publisher/dialogs/site-code-cryptovoxels-dialog/site-code-cryptovoxels-dialog.component';
import { PublisherService } from 'publisher/publisher.service';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';
import { HandleSubscription } from 'common/handle-subscription';
import { faExternalLinkSquareAlt, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { SessionService } from '../../../session.service';

@Component({
  selector: 'app-edit-site-basic-information',
  templateUrl: './edit-site-basic-information.component.html',
  styleUrls: ['./edit-site-basic-information.component.scss']
})
export class EditSiteBasicInformationComponent extends HandleSubscription implements OnInit {
  private static readonly WEBSITE_NAME_LENGTH_MAX: number = 64;
  private static readonly WEBSITE_DOMAIN_LENGTH_MAX: number = 255;
  private static readonly WEBSITE_URL_LENGTH_MAX: number = 1024;
  readonly ADD_UNIT_CRYPTOVOXELS = ADD_UNIT_CRYPTOVOXELS
  readonly ADD_UNIT_DECENTRALAND = ADD_UNIT_DECENTRALAND
  readonly faExternalLinkSquareAlt = faExternalLinkSquareAlt
  readonly faQuestionCircle = faQuestionCircle
  siteBasicInfoForm: FormGroup;
  languages: SiteLanguage[];
  siteBasicInfoSubmitted = false;
  site: Site = cloneDeep(siteInitialState);
  createSiteMode: boolean;
  filteredOptions: Observable<object>;
  siteCategoriesOptions : TargetingOptionValue[] = [];
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

  constructor(
    private action$: Actions,
    private router: Router,
    private route: ActivatedRoute,
    private publisherService: PublisherService,
    private session: SessionService,
    private store: Store<AppState>,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
    this.media = mapToIterable(this.route.snapshot.data.media);
    const updateSiteFailureSubscription = this.action$.ofType(UPDATE_SITE_FAILURE).subscribe(() => {
      this.changesSaving = false;
      this.store.dispatch(new ShowDialogOnError(''));
    });
    this.subscriptions.push(updateSiteFailureSubscription);
    this.createSiteMode = !!this.router.url.match('/create-site/');
    if (this.createSiteMode) {
      this.onMediumChange(this.media[0].key);
    }
    this.getLanguages();
    this.createForm();

    this.filteredOptions = this.siteBasicInfoForm.get('primaryLanguage').valueChanges
      .pipe(
        startWith(''),
        map((value: string | SiteLanguage) => typeof value === 'string' ? value : value.name),
        map((val: string) => val ? this.filterOptions(val) : this.languages.slice())
      )
  }

  get isConnectedWallet (): boolean {
    const user = this.session.getUser()
    return user.isConfirmed && user.adserverWallet.walletAddress !== null && user.adserverWallet.walletNetwork !== null
  }

  updateSelectedTargetingOptionValues(items): void {
    this.selectedTargetingOptionValues = [...items];
  }

  getLanguages(): void {
    const languageListSubscription = this.store.select('state', 'publisher', 'languagesList')
      .first()
      .subscribe((languagesList) => {
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

    const domain = this.site.domain;
    this.publisherService.validateDomain(domain).subscribe(
      () => {
        this.createSiteMode ? this.saveSiteBasicInformation() : this.updateSite();
      },
      (error) => {
        const message = error.error && error.error.message ? error.error.message : '';
        this.store.dispatch(new ShowDialogOnError(message));
        this.changesSaving = false;
      }
    );
  }

  onStepBack(): void {
    this.createSiteMode ? this.router.navigate(['/publisher', 'dashboard']) :
      this.router.navigate(['/publisher', 'site', this.site.id]);
  }

  saveSiteBasicInformation(): void {
    this.store.dispatch(new SaveLastEditedSite(this.site));
    this.router.navigate(['/publisher', 'create-site', this.getNextPath()]);
  }

  private getNextPath (): string {
    return this.site.medium !== 'metaverse' ? 'pops-settings' : 'additional-filtering'
  }

  updateSite(): void {
    this.store.dispatch(new UpdateSite(this.site));
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
        }
      });
      return false;
    }

    if (this.isSetCategoryMode && this.selectedTargetingOptionValues.length === 0) {
      return false;
    }

    this.site = {
      ...this.site,
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
    this.overwriteNameByDomain = name.length == 0 || name == domain;
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
        Validators.maxLength(EditSiteBasicInformationComponent.WEBSITE_NAME_LENGTH_MAX)
      ]),
      domain: new FormControl(siteInitialState.domain, [
        Validators.required,
        Validators.maxLength(EditSiteBasicInformationComponent.WEBSITE_DOMAIN_LENGTH_MAX),
        Validators.pattern(/^(?![.]).+\..+$/)
      ]),
      url: new FormControl(siteInitialState.url, [
        Validators.required,
        Validators.maxLength(EditSiteBasicInformationComponent.WEBSITE_URL_LENGTH_MAX),
        Validators.pattern(/^https?:\/\/(?![.])[^\/?#]+\.[^\/?#]+$/i)
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
    });
    this.siteBasicInfoForm.get('medium').valueChanges.subscribe(value => this.medium = value);
    this.getFormDataFromStore();
  }

  getFormDataFromStore(): void {
    const lastEditedSiteSubscription = this.store.select('state', 'publisher', 'lastEditedSite')
      .take(1)
      .subscribe((lastEditedSite) => {
        this.site = cloneDeep(lastEditedSite);
        this.site.primaryLanguage = lastEditedSite.primaryLanguage ?
          this.getSiteInitialLanguage(lastEditedSite.primaryLanguage) :
          this.getSiteInitialLanguage();
        this.siteBasicInfoForm.patchValue(this.site);
        this.onMediumChange(this.site.medium);
        if (this.site.medium === 'metaverse') {
          this.siteBasicInfoForm.get('url').disable();
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
    return language ? language.name : ''
  }

  filterOptions(val: string): object[] {
    const filterValue = val.toLowerCase();
    return this.languages.filter(option => option.name.toLowerCase().includes(filterValue) || option.code.toLowerCase().includes(filterValue))
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
    const siteCategoriesSubscription = this.publisherService.siteCategoriesOptions(medium, vendor)
      .subscribe(options => {
        this.siteCategoriesOptions = options;
        this.isSetCategoryMode = options.length > 0;
      })
    this.subscriptions.push(siteCategoriesSubscription);
  }

  onMediumChange (medium: string): void {
    const subscription = this.publisherService.getMediumVendors(medium)
      .take(1)
      .subscribe(vendors => {
        this.vendors = mapToIterable(vendors)
        if (this.createSiteMode) {
          const vendor = this.vendors.length > 0 ? this.vendors[0].key : null
          this.vendor = vendor
          this.siteBasicInfoForm.get('vendor').patchValue(vendor)
          this.loadSiteCategories(medium, vendor)
        }
      })
    this.subscriptions.push(subscription)
  }

  onVendorChange (vendor: string): void {
    this.vendor = vendor
    this.loadSiteCategories(this.siteBasicInfoForm.controls['medium'].value, vendor)
  }

  openGetCryptovoxelsCodeDialog (): void {
    this.dialog.open(SiteCodeCryptovoxelsDialogComponent);
  }
}
