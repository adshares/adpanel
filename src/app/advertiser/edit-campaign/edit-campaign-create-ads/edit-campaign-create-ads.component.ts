import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { first, take } from 'rxjs/operators';
import { FileUploader } from 'ng2-file-upload';
import {
  AddCampaignToCampaigns,
  ClearLastEditedCampaign,
  SaveCampaignAds,
  UpdateCampaign,
} from 'store/advertiser/advertiser.actions';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { AssetHelpersService } from 'common/asset-helpers.service';
import { adCreativeTypes, adStatusesEnum, fileTypes, validHtmlTypes, validModelTypes } from 'models/enum/ad.enum';
import { WarningDialogComponent } from 'common/dialog/warning-dialog/warning-dialog.component';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { HTTP_REQUEST_ENTITY_TOO_LARGE } from 'common/utilities/codes';
import { cloneDeep, cutDirectAdSizeAnchor } from 'common/utilities/helpers';
import { Ad, Campaign } from 'models/campaign.model';
import { environment } from 'environments/environment';
import { appSettings } from 'app-settings';
import { AppState } from 'models/app-state.model';
import { ADSHARES_UNITS, WIKI_HTML_AD } from 'models/enum/link.enum';
import { Format } from 'models/taxonomy-medium.model';
import { SessionService } from '../../../session.service';
import { ShowDialogOnError } from 'store/common/common.actions';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';

interface UploadingFile {
  name: string;
  size: number;
  overDrop: boolean[];
  upload: {
    processing: boolean;
    progress: number;
  };
  validation: {
    size: boolean;
    type: boolean;
    upload: boolean;
  }[];
}

@Component({
  selector: 'app-edit-campaign-create-ads',
  templateUrl: './edit-campaign-create-ads.component.html',
  styleUrls: ['./edit-campaign-create-ads.component.scss'],
})
export class EditCampaignCreateAdsComponent extends HandleSubscriptionComponent implements OnInit {
  readonly ADSHARES_UNITS = ADSHARES_UNITS;
  readonly WIKI_HTML_AD = WIKI_HTML_AD;
  readonly adCreativeTypes = adCreativeTypes;
  readonly appSettings = appSettings;
  adForms: FormGroup[] = [];
  adTypes: string[] = [];
  ads: Ad[] = [];
  adsSubmitted = false;
  adPanelsStatus: boolean[] = [];
  uploader: FileUploader = new FileUploader({
    url: `${environment.apiUrl}/upload_ad`,
    authToken: `Bearer ${this.session.getUser().apiToken}`,
  });
  changesSaved: boolean = false;
  imagesStatus: UploadingFile = {
    name: '',
    size: 0,
    upload: {
      processing: false,
      progress: 0,
    },
    overDrop: [],
    validation: [],
  };
  campaign: Campaign = null;
  isEditMode: boolean;
  formats: Format[];
  faPlus = faPlus;
  faCircleXmark = faCircleXmark;

  constructor(
    private advertiserService: AdvertiserService,
    private assetHelpers: AssetHelpersService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private session: SessionService,
    private matDialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.isEditMode = !!this.router.url.match('/edit-campaign/');
    const subscription = this.advertiserService.cleanEditedCampaignOnRouteChange(this.isEditMode);
    subscription && this.subscriptions.push(subscription);
    const lastCampaignSubscription = this.store
      .select('state', 'advertiser', 'lastEditedCampaign')
      .pipe(first())
      .subscribe(campaign => {
        this.campaign = campaign;
        const campaignNameFilled = this.assetHelpers.redirectIfNameNotFilled(campaign);
        if (!campaignNameFilled) {
          this.changesSaved = true;
          return;
        }

        this.advertiserService
          .getMedium(campaign.basicInformation.medium, campaign.basicInformation.vendor)
          .pipe(take(1))
          .subscribe(medium => {
            const supportedTypes = Object.values(adCreativeTypes);
            this.formats = medium.formats.filter(format => supportedTypes.includes(format.type));
            this.adTypes = this.formats.map(format => format.type);

            const savedAds = campaign.ads;
            if (savedAds.length > 0) {
              savedAds.forEach((savedAd, index) => {
                this.adForms.push(this.generateFormField(savedAd, this.isEditMode));
                this.ads.push(cloneDeep(savedAd));
                this.adPanelsStatus[index] = false;
              });
            } else {
              this.createEmptyAd();
            }
          });
      });
    this.subscriptions.push(lastCampaignSubscription);
  }

  createEmptyAd(): void {
    this.adsSubmitted = false;
    const ad = this.getAdInitialState();
    this.ads.push(ad);
    const adForm = this.generateFormField(ad, false);
    this.adForms.push(adForm);
    this.adPanelsStatus.fill(false);
    this.adPanelsStatus.push(true);
    this.adjustBannerName(adForm);

    EditCampaignCreateAdsComponent.scrollToLastForm();
  }

  private getAdInitialState(): Ad {
    const type = this.adTypes[0];
    const size = type === adCreativeTypes.HTML || type === adCreativeTypes.DIRECT ? this.getAdSizes(type)[0] : null;
    return {
      id: 0,
      status: adStatusesEnum.ACTIVE,
      name: '',
      creativeSize: size,
      creativeType: type,
      clicks: 0,
      impressions: 0,
      ctr: 0,
      averageCpc: 0,
      averageCpm: 0,
      cost: 0,
      budget: 0,
      url: null,
    };
  }

  private static scrollToLastForm(): void {
    const forms = document.getElementsByTagName('form');

    if (forms.length > 0) {
      forms[forms.length - 1].scrollIntoView();
    }
  }

  handlePanelExpand(adIndex: number): void {
    this.adPanelsStatus.fill(false);
    this.adPanelsStatus[adIndex] = true;
  }

  generateFormField(ad: Ad, disabledMode: boolean = false): FormGroup {
    const type = ad.creativeType;
    const formGroup = new FormGroup({
      name: new FormControl(ad.name, Validators.required),
      type: new FormControl({ value: type, disabled: disabledMode }),
      creativeSize: new FormControl({
        value: ad.creativeSize,
        disabled: disabledMode,
      }),
      creativeContents: new FormControl(
        cutDirectAdSizeAnchor(ad.creativeContents || this.campaign.basicInformation.targetUrl)
      ),
      status: new FormControl(ad.status),
    });

    if (EditCampaignCreateAdsComponent.isUploadAdType(type)) {
      formGroup.addControl('fileName', new FormControl(ad.name));
      formGroup.addControl('fileSrc', new FormControl(ad.url || '', Validators.required));
    } else {
      formGroup
        .get('creativeContents')
        .setValidators([Validators.required, Validators.pattern(appSettings.TARGET_URL_REGEXP)]);
    }

    formGroup.updateValueAndValidity();
    return formGroup;
  }

  private static isUploadAdType(type: string): boolean {
    return type !== adCreativeTypes.DIRECT;
  }

  fileOverDropArea(isOverDrop, adIndex: number): void {
    this.imagesStatus.overDrop[adIndex] = isOverDrop;
    if (!isOverDrop && this.uploader.queue[0]) {
      this.uploadBanner(adIndex, this.uploader.queue[0], true);
    }
  }

  uploadBanner(adIndex: number, event, dropped: boolean = false): void {
    const file = dropped ? event.file.rawFile : event.target.files[0];
    const form = this.adForms[adIndex];
    const adType = form.get('type').value;
    const isFileTypeValid = this.isFileMimeTypeValid(file.type, adType);
    const isFileSizeValid = file.size <= this.getMaxFileSize(adType);

    if (this.isHtmlTypeChosen(form)) {
      const sizeFromName = file.name.match(/[0-9]+x[0-9]+/);
      if (null !== sizeFromName && this.getAdSizes(adCreativeTypes.HTML).includes(sizeFromName[0])) {
        form.get('creativeSize').setValue(sizeFromName[0]);
      }
    }

    this.imagesStatus.validation.forEach(validation =>
      Object.keys(validation).forEach(key => (validation[key] = true))
    );

    if (event.target) {
      // this is necessary when user changes type of the banner and then uploads the same file
      event.target.value = '';
    }
    this.adjustBannerName(form);
    if (isFileTypeValid && isFileSizeValid) {
      this.sendFile(file, adIndex, form);
    } else {
      this.uploader.queue.pop();
      this.imagesStatus = {
        ...this.imagesStatus,
        name: file.name,
        size: file.size,
      };
      this.imagesStatus.validation[adIndex] = {
        type: isFileTypeValid,
        size: isFileSizeValid,
        upload: true,
      };
    }

    if (!!event.target) {
      event.target.value = ''; // this is necessary when user changes type of the banner and then uploads the same file
    }
  }

  private isFileMimeTypeValid(mimeType: string, adType: string): boolean {
    if (adType === adCreativeTypes.HTML) {
      return validHtmlTypes.includes(mimeType);
    }
    if (adType === adCreativeTypes.MODEL) {
      return validModelTypes.includes(mimeType);
    }
    const allowedMimeTypes = this.formats.find(format => format.type === adType).mimes;
    return allowedMimeTypes.includes(mimeType);
  }

  getMaxFileSize(adType: string): number {
    switch (adType) {
      case adCreativeTypes.IMAGE:
        return this.route.snapshot.data.bannersConfig.uploadLimitImage;
      case adCreativeTypes.HTML:
        return this.route.snapshot.data.bannersConfig.uploadLimitZip;
      case adCreativeTypes.VIDEO:
        return this.route.snapshot.data.bannersConfig.uploadLimitVideo;
      case adCreativeTypes.MODEL:
        return this.route.snapshot.data.bannersConfig.uploadLimitModel;
      default:
        return 0;
    }
  }

  presentedMaxFileSize(index: number): number {
    const adForm = this.adForms[index];
    const adType = adForm.get('type').value;
    return this.getMaxFileSize(adType);
  }

  adjustBannerName(form: FormGroup): void {
    if (!form.get('name').value) {
      form.get('name').reset();
    }
    if (form.get('name').dirty === false) {
      const type = form.get('type').value;
      let name = type.charAt(0).toUpperCase() + type.slice(1);
      if (form.get('creativeSize').value) {
        name = `${name} ${form.get('creativeSize').value}`;
      }
      const matchingNames = this.adForms.filter(
        adForm => adForm.get('name').value && adForm.get('name').value.includes(name)
      );
      if (matchingNames.length > 0) {
        name = `${name} ${matchingNames.length}`;
      }
      form.get('name').setValue(name);
    }
  }

  selectProperImageBannerSize(form: FormGroup, size: string): void {
    if (this.getAdSizes(adCreativeTypes.IMAGE).includes(size)) {
      form.get('creativeSize').setValue(size);
    } else {
      this.showImageSizeWarning();
    }
  }

  showImageSizeWarning(): void {
    this.matDialog.open(WarningDialogComponent, {
      data: {
        title: 'Inconsistent sizes',
        message:
          "We couldn't find size option matching uploaded banner dimensions. \n " +
          'You may consider changing ad banner size or upload new image',
      },
    });
  }

  sendFile(file, adIndex: number, form: FormGroup): void {
    const data = new FormData();
    data.append('file', file, file.name);
    data.append('medium', this.campaign.basicInformation.medium);
    if (null !== this.campaign.basicInformation.vendor) {
      data.append('vendor', this.campaign.basicInformation.vendor);
    }
    data.append('type', form.get('type').value);
    if (null !== form.get('creativeSize').value) {
      data.append('scope', form.get('creativeSize').value);
    }
    const uploadBannerSubscription = this.advertiserService.uploadBanner(data).subscribe(
      event => {
        if (event.type === 1) {
          this.imagesStatus.upload.processing = true;
          this.imagesStatus.upload.progress = Math.round((event.loaded / event.total) * 100);
        } else {
          this.imagesStatus.upload.processing = false;
          this.uploader.queue.pop();

          if (!event.body) {
            return;
          }
          this.ads[adIndex] = {
            ...this.ads[adIndex],
            url: event.body.url,
          };
          if (this.isImageTypeChosen(form)) {
            this.selectProperImageBannerSize(form, event.body.size);
          } else if (this.isVideoTypeChosen(form)) {
            form.get('creativeSize').setValue(event.body.size);
          } else if (this.isModelTypeChosen(form)) {
            form.get('creativeSize').setValue(event.body.size || 'cube');
          }
          form.get('fileName').setValue(file.name);
          form.get('fileSrc').setValue(event.body.url);
        }
      },
      error =>
        this.store.dispatch(
          new ShowDialogOnError(
            error.error.code === HTTP_REQUEST_ENTITY_TOO_LARGE ? 'Payload too large' : error.error.message
          )
        )
    );
    this.subscriptions.push(uploadBannerSubscription);
  }

  updateAdInfo(adIndex: number): void {
    Object.assign(this.ads[adIndex], {
      name: this.adForms[adIndex].get('name').value,
      creativeSize: this.adForms[adIndex].get('creativeSize').value,
      creativeType: this.adForms[adIndex].get('type').value,
      creativeContents: this.adForms[adIndex].get('creativeContents').value,
      status: this.adForms[adIndex].get('status').value,
    });
  }

  setAdType(adIndex: number): void {
    this.adsSubmitted = false;
    const adForm = this.adForms[adIndex];
    const adTypeName = adForm.get('type').value;

    if (this.imagesStatus.validation[adIndex]) {
      this.imagesStatus.validation.splice(adIndex, 1);
    }

    if (adForm.get('fileSrc')) {
      adForm.removeControl('fileName');
      adForm.removeControl('fileSrc');
    }
    if (EditCampaignCreateAdsComponent.isUploadAdType(adTypeName)) {
      adForm.addControl('fileName', new FormControl(''));
      adForm.addControl('fileSrc', new FormControl('', Validators.required));
      adForm.get('creativeContents').setValidators([]);
    } else {
      adForm
        .get('creativeContents')
        .setValidators([Validators.required, Validators.pattern(appSettings.TARGET_URL_REGEXP)]);
    }

    const initialCreativeSize =
      adTypeName === adCreativeTypes.HTML || adTypeName === adCreativeTypes.DIRECT
        ? this.getAdSizes(adTypeName)[0]
        : null;
    adForm.get('creativeSize').setValue(initialCreativeSize);

    this.adjustBannerName(adForm);
    adForm.updateValueAndValidity();
  }

  setAdSize(adIndex: number): void {
    const adForm = this.adForms[adIndex];
    this.adjustBannerName(adForm);
  }

  getAdSizes(adType: string): string[] {
    const scopes = this.formats.find(format => format.type === adType).scopes;

    if (adType === adCreativeTypes.HTML) {
      return Object.keys(scopes).sort((a, b) => {
        const sizesA = a.split('x').map(val => parseInt(val));
        const sizesB = b.split('x').map(val => parseInt(val));
        return sizesA[0] === sizesB[0] ? sizesA[1] - sizesB[1] : sizesA[0] - sizesB[0];
      });
    }

    return Object.keys(scopes);
  }

  onSubmit(isDraft: boolean = false): void {
    this.adsSubmitted = true;
    this.changesSaved = true;

    this.adForms.forEach((adForm, index) => {
      adForm.updateValueAndValidity();
      this.updateAdInfo(index);
    });

    const adsValid =
      this.adForms.every(adForm => adForm.valid) &&
      this.imagesStatus.validation.every(validation => validation.size && validation.type);

    if (adsValid) {
      this.campaign = {
        ...this.campaign,
        ads: this.ads,
      };
      this.isEditMode
        ? this.store.dispatch(new UpdateCampaign(this.campaign))
        : this.saveCampaignAds(this.campaign, isDraft);
    } else {
      this.changesSaved = false;
    }
  }

  saveCampaignAds(campaign: Campaign, isDraft?: boolean): void {
    if (isDraft) {
      this.store.dispatch(new AddCampaignToCampaigns(campaign));
    } else {
      this.store.dispatch(new SaveCampaignAds(this.ads));
      this.router.navigate(['/advertiser', 'create-campaign', 'summary']);
    }
  }

  removeNewAd(adIndex: number): void {
    [this.adForms, this.ads, this.adPanelsStatus, this.imagesStatus.overDrop, this.imagesStatus.validation].forEach(
      list => list.splice(adIndex, 1)
    );
  }

  onStepBack(): void {
    if (this.isEditMode) {
      this.store.dispatch(new ClearLastEditedCampaign());
      this.router.navigate(['/advertiser', 'campaign', this.campaign.id]);
    } else {
      this.router.navigate(['/advertiser', 'create-campaign', 'additional-targeting']);
    }
  }

  isImageTypeChosen(form: FormGroup): boolean {
    return form.get('type').value === adCreativeTypes.IMAGE;
  }

  isHtmlTypeChosen(form: FormGroup): boolean {
    return form.get('type').value === adCreativeTypes.HTML;
  }

  isDirectTypeChosen(form: FormGroup): boolean {
    return form.get('type').value === adCreativeTypes.DIRECT;
  }

  isVideoTypeChosen(form: FormGroup): boolean {
    return form.get('type').value === adCreativeTypes.VIDEO;
  }

  isModelTypeChosen(form: FormGroup): boolean {
    return form.get('type').value === adCreativeTypes.MODEL;
  }

  getSupportedFiles(form: FormGroup): string {
    const adType = form.get('type').value;
    const mimeTypes = this.formats.find(format => format.type === adType).mimes;
    const extensions = mimeTypes.map(mimeType => fileTypes[mimeType] || false).filter(mimeType => mimeType);
    if (extensions.length > 1) {
      extensions[extensions.length - 2] += ` and ${extensions.pop()}`;
    }
    return extensions.join(', ');
  }

  getSupportedFileSize(form: FormGroup): number {
    const adType = form.get('type').value;
    return this.getMaxFileSize(adType);
  }

  cancelUploading(): void {
    this.uploader.queue.pop();
    this.imagesStatus = {
      ...this.imagesStatus,
      name: '',
      size: 0,
      upload: {
        processing: false,
        progress: 0,
      },
    };
  }
}
