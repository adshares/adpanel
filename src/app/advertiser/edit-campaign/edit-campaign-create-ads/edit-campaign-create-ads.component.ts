import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Store } from '@ngrx/store'
import { MatDialog } from '@angular/material'
import { FileUploader } from 'ng2-file-upload'
import {
  AddCampaignToCampaigns,
  ClearLastEditedCampaign,
  SaveCampaignAds,
  UpdateCampaign
} from 'store/advertiser/advertiser.actions'
import { AdvertiserService } from 'advertiser/advertiser.service'
import { AssetHelpersService } from 'common/asset-helpers.service'
import {
  adCreativeTypes,
  adStatusesEnum,
} from 'models/enum/ad.enum'
import { WarningDialogComponent } from 'common/dialog/warning-dialog/warning-dialog.component'
import { HandleSubscription } from 'common/handle-subscription'
import { cloneDeep, cutDirectAdSizeAnchor } from 'common/utilities/helpers'
import { Ad, Campaign } from 'models/campaign.model'
import { environment } from 'environments/environment'
import { appSettings } from 'app-settings'
import { AppState } from 'models/app-state.model'
import { Format } from 'models/taxonomy-medium.model'
import { SessionService } from '../../../session.service'
import { ShowDialogOnError } from 'store/common/common.actions'

interface UploadingFile {
  name: string,
  size: number,
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
export class EditCampaignCreateAdsComponent extends HandleSubscription implements OnInit {
  readonly adCreativeTypes = adCreativeTypes;
  readonly appSettings = appSettings;
  adForms: FormGroup[] = [];
  adTypes: string[];
  adStatusesEnum = adStatusesEnum;
  ads: Ad[] = [];
  adsSubmitted = false;
  adPanelsStatus: boolean[] = [];
  uploader: FileUploader = new FileUploader({
    url: `${environment.apiUrl}/upload_ad`,
    authToken: `Bearer ${this.session.getUser().apiToken}`
  });
  changesSaved: boolean = false;
  imagesStatus: UploadingFile = {
    name: '',
    size: 0,
    upload: {
      processing: false,
      progress: 0
    },
    overDrop: [],
    validation: []
  };
  campaign: Campaign = null;
  isEditMode: boolean;
  formats: Format[];

  constructor(
    private advertiserService: AdvertiserService,
    private assetHelpers: AssetHelpersService,
    private router: Router,
    private store: Store<AppState>,
    private session: SessionService,
    private matDialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
    this.isEditMode = !!this.router.url.match('/edit-campaign/');
    const subscription = this.advertiserService.cleanEditedCampaignOnRouteChange(this.isEditMode);
    subscription && this.subscriptions.push(subscription);
    const lastCampaignSubscription = this.store.select('state', 'advertiser', 'lastEditedCampaign')
      .first()
      .subscribe((lastEditedCampaign: Campaign) => {
        this.campaign = lastEditedCampaign;
        const campaignNameFilled = this.assetHelpers.redirectIfNameNotFilled(lastEditedCampaign);
        if (!campaignNameFilled) {
          this.changesSaved = true;
          return;
        }

        this.advertiserService.getMedium(lastEditedCampaign.basicInformation.mediumName)
          .take(1)
          .subscribe(medium => {
            const supportedTypes = Object.values(adCreativeTypes);
            this.formats = medium.formats.filter(format => supportedTypes.includes(format.type));
            this.adTypes = this.formats.map(format => format.type);

            const savedAds = lastEditedCampaign.ads;
            if (savedAds.length > 0) {
              savedAds.forEach((savedAd, index) => {
                this.adForms.push(this.generateFormField(savedAd, this.isEditMode));
                this.ads.push(cloneDeep(savedAd));
                this.adPanelsStatus[index] = false;
              });
            } else {
              this.createEmptyAd();
            }
          })
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

  private getAdInitialState (): Ad {
    const type = this.adTypes[0]
    const size = (type === adCreativeTypes.IMAGE || type === adCreativeTypes.VIDEO) ? null : this.getAdSizes(type)[0]
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
    }
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
      type: new FormControl({value: type, disabled: disabledMode}),
      creativeSize: new FormControl({value: ad.creativeSize, disabled: disabledMode}),
      creativeContents: new FormControl(cutDirectAdSizeAnchor(ad.creativeContents || this.campaign.basicInformation.targetUrl)),
      status: new FormControl(ad.status)
    });

    let state = {};
    if (type === adCreativeTypes.IMAGE || type === adCreativeTypes.VIDEO || type === adCreativeTypes.HTML) {
      state = {name: ad.name, src: ad.url || ''};
    } else if (type === adCreativeTypes.DIRECT) {
      state = {name: ad.name};
      formGroup.get('creativeContents').setValidators([
        Validators.required,
        Validators.pattern(appSettings.TARGET_URL_REGEXP),
      ]);
    }

    formGroup.controls[type] = new FormControl(state);
    formGroup.updateValueAndValidity();

    return formGroup;
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
    const isFileSizeValid = file.size <= EditCampaignCreateAdsComponent.getMaxFileSize(adType);

    if (this.isHtmlTypeChosen(form)) {
      const sizeFromName = file.name.match(/[0-9]+x[0-9]+/)
      if (null !== sizeFromName && this.getAdSizes(adCreativeTypes.HTML).includes(sizeFromName[0])) {
        form.get('creativeSize').setValue(sizeFromName[0])
      }
    }

    this.imagesStatus.validation.forEach(
      (validation) => Object.keys(validation).forEach((key) => validation[key] = true)
    );

    if (event.target) {
      // this is necessary when user changes type of the banner and then uploads the same file
      event.target.value = '';
    }
    this.adjustBannerName(form);
    if (isFileTypeValid && isFileSizeValid) {
      this.sendImage(file, adIndex, form);
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
        upload: true
      };
    }

    if (!!event.target) {
      event.target.value = ''; // this is necessary when user changes type of the banner and then uploads the same file
    }
  }

  private isFileMimeTypeValid (mimeType: string, adType: string): boolean {
    const allowedMimeTypes = this.formats.find(format => format.type === adType).mimes;
    return allowedMimeTypes.includes(mimeType);
  }

  private static getMaxFileSize (adType: string): number {
    if (adType === adCreativeTypes.IMAGE) {
      return appSettings.MAX_AD_SIZE_IMAGE
    }
    if (adType === adCreativeTypes.HTML) {
      return appSettings.MAX_AD_SIZE_HTML
    }
    return appSettings.MAX_AD_SIZE_VIDEO
  }

  presentedMaxFileSize (index: number): number {
    const adForm = this.adForms[index]
    const adType = adForm.get('type').value
    return EditCampaignCreateAdsComponent.getMaxFileSize(adType)
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
      const matchingNames = this.adForms.filter(adForm => adForm.get('name').value && adForm.get('name').value.includes(name));
      if (matchingNames.length > 0) {
        name = `${name} ${matchingNames.length}`
      }
      form.get('name').setValue(name)
    }
  }

  scaleImageToMatchBanner(index: number): string {
    const banners = Array.from(document.querySelectorAll('.banner'));
    if (!banners[index]) {
      return '1';
    }
    const image = banners[index].querySelector('img');
    const sizes = this.adForms[index].get('creativeSize').value.split('x');
    const bannerWidth = parseInt(sizes[0]);
    const bannerHeight = parseInt(sizes[1]);
    const imageWidth = image.offsetWidth;
    const imageHeight = image.offsetHeight;
    const heightRatio = bannerHeight / imageHeight;
    const widthRatio = bannerWidth / imageWidth;

    return heightRatio <= widthRatio ? heightRatio.toFixed(2) : widthRatio.toFixed(2);
  }

  selectProperImageBannerSize(size: string, index: number): void {
    if (this.getAdSizes(adCreativeTypes.IMAGE).includes(size)) {
      this.adForms[index].get('creativeSize').setValue(size);
    } else {
      this.showImageSizeWarning();
    }
  }

  showImageSizeWarning(): void {
    this.matDialog.open(WarningDialogComponent, {
      data: {
        title: 'Inconsistent sizes',
        message: 'We couldn\'t find size option matching uploaded banner dimensions. \n ' +
          'You may consider changing ad banner size or upload new image',
      }
    });
  }

  sendImage(image, adIndex: number, form: FormGroup): void {
    const data = new FormData();
    data.append('file', image, image.name);
    const uploadBannerSubscription = this.advertiserService.uploadBanner(data).subscribe(
      (event) => {
        if (event.type === 1) {
          this.imagesStatus.upload.processing = true;
          this.imagesStatus.upload.progress = Math.round(event.loaded / event.total * 100);
        } else {
          this.imagesStatus.upload.processing = false;
          this.uploader.queue.pop();

          if (this.isImageTypeChosen(form) && event.body) {
            this.selectProperImageBannerSize(event.body.size, adIndex);
            this.ads[adIndex] = {
              ...this.ads[adIndex],
              url: event.body.url,
              name: image.name,
              imageSize: event.body.size
            };
            this.adForms[adIndex].get('image').setValue({
              name: image.name,
              src: event.body.url,
            });
          } else if (this.isHtmlTypeChosen(form) && event.body) {
            this.ads[adIndex] = {
              ...this.ads[adIndex],
              url: event.body.url,
            };
            this.adForms[adIndex].get('html').setValue({
              src: event.body.url,
              name: image.name
            });
          } else if (this.isVideoTypeChosen(form) && event.body) {
            this.adForms[adIndex].get('creativeSize').setValue(event.body.size);
            this.ads[adIndex] = {
              ...this.ads[adIndex],
              url: event.body.url,
              name: image.name,
              imageSize: event.body.size,
            };
            this.adForms[adIndex].get('video').setValue({
              name: image.name,
              src: event.body.url,
            });
          }
        }
      },
      (err) => this.store.dispatch(new ShowDialogOnError(err.error.message))
    );
    this.subscriptions.push(uploadBannerSubscription);
  }

  removeImage(adIndex: number): void {
    Object.assign(this.ads[adIndex], {url: '', imageSize: ''});
    this.adForms[adIndex].get('image').setValue({name: '', src: ''});
    this.imagesStatus.validation.splice(adIndex, 1);
    this.adsSubmitted = false;
  }

  updateAdInfo(adIndex: number): void {
    Object.assign(this.ads[adIndex], {
      name: this.adForms[adIndex].get('name').value,
      creativeSize: this.adForms[adIndex].get('creativeSize').value,
      creativeType: this.adForms[adIndex].get('type').value,
      creativeContents: this.adForms[adIndex].get('creativeContents').value,
      status: this.adForms[adIndex].get('status').value
    });
  }

  setAdType(adIndex: number): void {
    this.adsSubmitted = false;
    const adForm = this.adForms[adIndex];
    const adTypeName = adForm.get('type').value;

    if (this.imagesStatus.validation[adIndex]) {
      this.imagesStatus.validation.splice(adIndex, 1);
    }

    this.adTypes.forEach((type) => delete adForm.controls[type]);
    adForm.controls[adTypeName] = new FormControl({src: ''});
    adForm.updateValueAndValidity();

    if (adForm.get('html')) {
      adForm.get('creativeSize').setValue(this.getAdSizes(adCreativeTypes.HTML)[0]);
      adForm.get('creativeContents').setValidators([]);
    } else if (adForm.get('direct')) {
      adForm.get('creativeSize').setValue(this.getAdSizes(adCreativeTypes.DIRECT)[0]);
      adForm.get('creativeContents').setValidators([
        Validators.required,
        Validators.pattern(appSettings.TARGET_URL_REGEXP),
      ]);
    } else {
      adForm.get('creativeSize').setValue(null);
      adForm.get('creativeContents').setValidators([]);
    }
    this.adjustBannerName(adForm);
  }

  setAdSize(adIndex: number): void {
    const adForm = this.adForms[adIndex];
    this.adjustBannerName(adForm);
  }

  getAdSizes(adType: string): string[] {
    const scopes = this.formats.find(format => format.type === adType).scopes

    if (adType === adCreativeTypes.HTML) {
      return Object.keys(scopes).sort((a, b) => {
        const sizesA = a.split('x').map(val => parseInt(val))
        const sizesB = b.split('x').map(val => parseInt(val))
        return sizesA[0] === sizesB[0] ? sizesA[1] - sizesB[1] : sizesA[0] - sizesB[0]
      })
    }

    return Object.keys(scopes);
  }

  onSubmit(isDraft: boolean = false): void {
    this.adsSubmitted = true;
    this.changesSaved = true;

    this.adForms.forEach((adForm) => adForm.updateValueAndValidity());
    this.adForms.forEach((form, index) => this.updateAdInfo(index));

    const adsValid = this.adForms.every((adForm) => adForm.valid) &&
      this.adForms.every((adForm, index) => this.isDirectTypeChosen(adForm) || !!this.ads[index].url) &&
      this.imagesStatus.validation.every((validation) => validation.size && validation.type);

    if (adsValid) {
      this.campaign = {
        ...this.campaign,
        ads: this.ads,
      };
      this.isEditMode ?
        this.store.dispatch(new UpdateCampaign(this.campaign)) : this.saveCampaignAds(this.campaign, isDraft)
    } else {
      this.changesSaved = false;
    }
  }

  saveCampaignAds(campaign: Campaign, isDraft?: boolean): void {
    if (isDraft) {
      this.store.dispatch(new AddCampaignToCampaigns(campaign));
    } else {
      this.store.dispatch(new SaveCampaignAds(this.ads));
      this.router.navigate(
        ['/advertiser', 'create-campaign', 'summary'],
        {queryParams: {step: 5}}
      );
    }
  }

  removeNewAd(adIndex: number): void {
    [this.adForms, this.ads, this.adPanelsStatus, this.imagesStatus.overDrop, this.imagesStatus.validation]
      .forEach((list) => list.splice(adIndex, 1))
  }

  onStepBack(): void {
    if (this.isEditMode) {
      this.store.dispatch(new ClearLastEditedCampaign());
      this.router.navigate(['/advertiser', 'campaign', this.campaign.id]);
    } else {
      this.router.navigate(['/advertiser', 'create-campaign', 'additional-targeting'],
        {queryParams: {step: 4}})
    }
  }

  isImageTypeChosen(form: FormGroup): boolean {
    return form.get('type').value === adCreativeTypes.IMAGE
  }

  isHtmlTypeChosen(form: FormGroup): boolean {
    return form.get('type').value === adCreativeTypes.HTML
  }

  isDirectTypeChosen(form: FormGroup): boolean {
    return form.get('type').value === adCreativeTypes.DIRECT
  }

  isVideoTypeChosen(form: FormGroup): boolean {
    return form.get('type').value === adCreativeTypes.VIDEO
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
      }
    }
  }
}
