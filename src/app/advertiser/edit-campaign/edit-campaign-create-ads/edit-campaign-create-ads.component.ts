import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/first';
import { MatDialog } from '@angular/material';
import { FileUploader } from 'ng2-file-upload';
import {
  AddCampaignToCampaigns,
  ClearLastEditedCampaign,
  SaveCampaignAds,
  UpdateCampaign
} from 'store/advertiser/advertiser.actions';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { AssetHelpersService } from 'common/asset-helpers.service';
import {
  adStatusesEnum,
  adTypesEnum,
  adUnitTypesEnum,
  displayAdSizesEnum,
  popAdSizesEnum,
  validHtmlTypes,
  validImageTypes
} from 'models/enum/ad.enum';
import { WarningDialogComponent } from 'common/dialog/warning-dialog/warning-dialog.component';
import { HandleSubscription } from 'common/handle-subscription';
import { cloneDeep, cutDirectAdSizeAnchor, enumToArray } from 'common/utilities/helpers';
import { adInitialState } from 'models/initial-state/ad';
import { Ad, Campaign, TextAdSource } from 'models/campaign.model';
import { AdUnitMetaData } from 'models/site.model';
import { environment } from 'environments/environment';
import { appSettings } from 'app-settings';
import { AppState } from 'models/app-state.model';
import { SessionService } from '../../../session.service';
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
  readonly TEXT_AD_TITLE_MAX_LENGTH = 30;
  readonly TEXT_AD_TEXT_MAX_LENGTH = 90;

  adForms: FormGroup[] = [];
  adTypes: string[] = enumToArray(adTypesEnum);
  displayAdSizes: string[] = enumToArray(displayAdSizesEnum);
  popAdSizes: string[] = enumToArray(popAdSizesEnum);
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
  textAdsMetaData: AdUnitMetaData[];
  textAdsFormGroupSubmitted: boolean = false;
  textAdsFormGroup: FormGroup;
  selectedTextAdsSizes: string[] = [];

  constructor(
    private advertiserService: AdvertiserService,
    private assetHelpers: AssetHelpersService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private session: SessionService,
    private matDialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
    this.isEditMode = !!this.router.url.match('/edit-campaign/');
    this.textAdsMetaData = this.getTextAdsMetaData();
    this.textAdsFormGroup = this.generateTextAdsFormGroup();
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

        const savedAds = lastEditedCampaign.ads;

        if (!!savedAds.length) {
          savedAds.forEach((savedAd, index) => {
            this.adForms.push(this.generateFormField(savedAd, this.isEditMode));
            this.ads.push(cloneDeep(savedAd));
            this.adPanelsStatus[index] = false;
          });
        } else {
          this.createEmptyAd();
        }
      });
    this.subscriptions.push(lastCampaignSubscription);
  }

  private getTextAdsMetaData(): AdUnitMetaData[] {
    const adUnitSizes: AdUnitMetaData[] = cloneDeep(this.route.snapshot.data.adUnitSizes);

    return adUnitSizes.filter(
      adUnitSize => adUnitSize.type !== adUnitTypesEnum.POP && !['120x90', '120x60', '88x31'].includes(adUnitSize.size)
    );
  }

  createEmptyAd(): void {
    this.adsSubmitted = false;
    this.ads.push(cloneDeep(adInitialState));
    const adForm = this.generateFormField(adInitialState, false);
    this.adForms.push(adForm);
    this.adPanelsStatus.fill(false);
    this.adPanelsStatus.push(true);
    this.adjustBannerName(adForm);

    EditCampaignCreateAdsComponent.scrollToLastForm();
  }

  private static scrollToLastForm(): void {
    const forms = document.getElementsByTagName('form');

    if (forms.length > 0) {
      forms[forms.length - 1].scrollIntoView();
    }
  }

  handlePanelExpand(adIndex): void {
    this.adPanelsStatus.fill(false);
    this.adPanelsStatus[adIndex] = true;
  }

  generateFormField(ad, disabledMode: boolean = false): FormGroup {
    const adTypeName = this.adTypes[ad.type];
    const formGroup = new FormGroup({
      name: new FormControl(ad.name, Validators.required),
      type: new FormControl({value: ad.type, disabled: disabledMode}),
      creativeSize: new FormControl({value: ad.creativeSize, disabled: disabledMode}),
      creativeContents: new FormControl(cutDirectAdSizeAnchor(ad.creativeContents || this.campaign.basicInformation.targetUrl)),
      status: new FormControl(ad.status)
    });

    let state = {};
    if (ad.type === adTypesEnum.IMAGE) {
      state = {name: ad.name, src: ad.url || '', size: ad.size};
    } else if (ad.type === adTypesEnum.HTML) {
      state = {name: ad.name, src: ad.url || ''};
    } else if (ad.type === adTypesEnum.DIRECT) {
      state = {name: ad.name, size: ad.size};
      formGroup.get('creativeContents').setValidators([
        Validators.required,
        Validators.pattern(appSettings.TARGET_URL_REGEXP),
      ]);
    }

    formGroup.controls[adTypeName] = new FormControl(state);
    formGroup.updateValueAndValidity();

    return formGroup;
  }

  generateTextAdsFormGroup(): FormGroup {
    return new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(this.TEXT_AD_TITLE_MAX_LENGTH)]),
      text: new FormControl('', [Validators.maxLength(this.TEXT_AD_TEXT_MAX_LENGTH)]),
    });
  }

  fileOverDropArea(isOverDrop, adIndex): void {
    this.imagesStatus.overDrop[adIndex] = isOverDrop;
    if (!isOverDrop && this.uploader.queue[0]) {
      this.uploadBanner(this.uploader.queue[0], true);
    }
  }

  getExpandedPanelIndex(): number {
    return this.adPanelsStatus.findIndex(function (element: boolean) {
      return element;
    });
  }

  uploadBanner(event, dropped: boolean = false): void {
    const file = dropped ? event.file.rawFile : event.target.files[0];
    const adIndex = this.getExpandedPanelIndex();
    const form = this.adForms[adIndex];
    const isUploadedTypeValid = this.isImageTypeChosen(form) ?
      enumToArray(validImageTypes).indexOf(file.type) > -1 : enumToArray(validHtmlTypes).indexOf(file.type) > -1;
    const isImageSizeValid = file.size <= appSettings.MAX_AD_IMAGE_SIZE;

    this.imagesStatus.validation.forEach(
      (validation) => Object.keys(validation).forEach((key) => validation[key] = true)
    );

    if (event.target) {
      // this is necessary when user changes type of the banner and then uploads the same file
      event.target.value = '';
    }
    this.adjustBannerName(form);
    if (isUploadedTypeValid && isImageSizeValid) {
      this.sendImage(file, adIndex, form);
    } else {
      this.uploader.queue.pop();
      this.imagesStatus = {
        ...this.imagesStatus,
        name: file.name,
        size: file.size,
      };
      this.imagesStatus.validation[adIndex] = {
        type: isUploadedTypeValid,
        size: isImageSizeValid,
        upload: true
      };
    }

    if (!!event.target) {
      event.target.value = ''; // this is necessary when user changes type of the banner and then uploads the same file
    }
  }

  adjustBannerName(form: FormGroup): void {
    if (!form.get('name').value) {
      form.get('name').reset();
    }
    if (form.get('name').dirty === false) {
      let name = form.get('creativeSize').value ?
        `${adTypesEnum[form.get('type').value]} ${form.get('creativeSize').value}` :
        `${adTypesEnum[form.get('type').value]}`;
      const matchingNames = this.adForms.filter(form => form.get('name').value && form.get('name').value.includes(name));
      if (matchingNames.length > 0) {
        name = `${name} ${matchingNames.length}`
      }
      form.get('name').setValue(name)
    }
  }

  scaleImageToMatchBanner(index) {
    const banners = Array.from(document.querySelectorAll('.banner')) as Array<HTMLElement>;
    if (!banners[index]) {
      return 1;
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

  selectProperBannerSize(size: string, index: number): void {
    if (this.displayAdSizes.includes(size)) {
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

  sendImage(image, adIndex, form): void {
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
            this.selectProperBannerSize(event.body.size, adIndex);
            this.ads[adIndex] = {
              ...this.ads[adIndex],
              url: event.body.url,
              name: image.name,
              imageSize: event.body.size
            };
            this.adForms[adIndex].get('image').setValue({
              name: image.name,
              src: event.body.url,
              size: event.body.size
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
          }
        }
      },
      (err) => this.store.dispatch(new ShowDialogOnError(err.error.message))
    );
    this.subscriptions.push(uploadBannerSubscription);
  }

  removeImage(adIndex): void {
    Object.assign(this.ads[adIndex], {url: '', imageSize: ''});
    this.adForms[adIndex].get('image').setValue({name: '', src: '', size: ''});
    this.imagesStatus.validation.splice(adIndex, 1);
    this.adsSubmitted = false;
  }

  updateAdInfo(adIndex): void {
    Object.assign(this.ads[adIndex], {
      type: this.adForms[adIndex].get('type').value,
      name: this.adForms[adIndex].get('name').value,
      creativeSize: this.adForms[adIndex].get('creativeSize').value,
      creativeContents: this.adForms[adIndex].get('creativeContents').value,
      status: this.adForms[adIndex].get('status').value
    });
  }

  setAdType(adIndex): void {
    this.adsSubmitted = false;
    const adForm = this.adForms[adIndex];
    const adType = adForm.get('type').value;
    const adTypeName = this.adTypes[adType];

    if (this.imagesStatus.validation[adIndex]) {
      this.imagesStatus.validation.splice(adIndex, 1);
    }

    this.adTypes.forEach((type) => delete adForm.controls[type]);
    adForm.controls[adTypeName] = new FormControl({src: ''});
    adForm.updateValueAndValidity();

    if (adForm.get('html')) {
      adForm.get('creativeSize').setValue(this.displayAdSizes[0]);
      adForm.get('creativeContents').setValidators([]);
    } else if (adForm.get('direct')) {
      adForm.get('creativeSize').setValue(this.popAdSizes[0]);
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

  setAdSize(adIndex): void {
    const adForm = this.adForms[adIndex];
    this.adjustBannerName(adForm);
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

  removeNewAd(adIndex): void {
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
    return form.get('type').value === adTypesEnum.IMAGE;
  }

  isHtmlTypeChosen(form: FormGroup): boolean {
    return form.get('type').value === adTypesEnum.HTML;
  }

  isDirectTypeChosen(form: FormGroup): boolean {
    return form.get('type').value === adTypesEnum.DIRECT;
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
    };
  }

  isTextAdSizeSelected(size: string): boolean {
    return this.selectedTextAdsSizes.includes(size);
  }

  toggleTextAdSize(size: string): void {
    const index = this.selectedTextAdsSizes.findIndex((selectedSize) => selectedSize === size);
    if (index === -1) {
      this.selectedTextAdsSizes.push(size);
    } else {
      this.selectedTextAdsSizes.splice(index, 1);
    }
  }

  generateTextAds(): void {
    this.textAdsFormGroupSubmitted = true;

    if (this.isTextAdsFormInvalid) {
      return;
    }

    const text = this.textAdsFormGroup.get('text').value;
    const textAdSource: TextAdSource = {
      title: this.textAdsFormGroup.get('title').value,
      text: text ? text : null,
    };
    this.advertiserService.generateTextAds(textAdSource, this.selectedTextAdsSizes).subscribe(
      response => this.handleGenerateTextAdsResponse(response, textAdSource),
      (error) => {
        const status = error.status ? error.status : 0;
        this.store.dispatch(new ShowDialogOnError(`Ads cannot be generated at this moment. Error code (${status})`));
      }
    );
  }

  private handleGenerateTextAdsResponse(response, textAdSource: TextAdSource): void {
    for (const size in response) {
      if (!response.hasOwnProperty(size)) {
        continue;
      }
      let ad: Ad = cloneDeep(adInitialState);
      ad.creativeSize = size;
      ad.type = adTypesEnum.HTML;
      ad.name = response[size]['name'];
      ad.url = response[size]['url'];
      ad.textAdSource = textAdSource;
      const adForm = this.generateFormField(ad, false);
      this.adForms.push(adForm);
      this.ads.push(ad);
      this.adPanelsStatus.push(false);
      this.adjustBannerName(adForm);
    }

    EditCampaignCreateAdsComponent.scrollToLastForm();
  }

  get isTextAdsFormInvalid() {
    return !this.textAdsFormGroup.valid || this.selectedTextAdsSizes.length === 0;
  }
}
