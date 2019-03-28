import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/first';
import { MatDialog } from '@angular/material';
import { FileUploader } from 'ng2-file-upload';
import {
  AddCampaignToCampaigns,
  SaveCampaignAds,
  UpdateCampaign,
  ClearLastEditedCampaign
} from 'store/advertiser/advertiser.actions';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { AssetHelpersService } from 'common/asset-helpers.service';
import { adSizesEnum, adStatusesEnum, adTypesEnum, validHtmlTypes, validImageTypes } from 'models/enum/ad.enum';
import { WarningDialogComponent } from "common/dialog/warning-dialog/warning-dialog.component";
import { HandleSubscription } from "common/handle-subscription";
import { cloneDeep, enumToArray } from 'common/utilities/helpers';
import { adInitialState } from 'models/initial-state/ad';
import { Ad, Campaign } from 'models/campaign.model';
import { environment } from 'environments/environment';
import { appSettings } from 'app-settings';
import { AppState } from 'models/app-state.model';
import { SessionService } from "../../../session.service";

interface ImagesStatus {
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
  adForms: FormGroup[] = [];
  adTypes: string[] = enumToArray(adTypesEnum);
  adSizes: string[] = enumToArray(adSizesEnum);
  adStatusesEnum = adStatusesEnum;
  ads: Ad[] = [];
  adsSubmitted = false;
  adPanelsStatus: boolean[] = [];
  uploader: FileUploader = new FileUploader({
    url: `${environment.apiUrl}/upload_ad`,
    authToken: `Bearer ${this.session.getUser().apiToken}`
  });
  changesSaved: boolean = false;
  imagesStatus: ImagesStatus = {
    upload: {
      processing: false,
      progress: 0
    },
    overDrop: [],
    validation: []
  };
  campaign: Campaign = null;
  isEditMode: boolean;

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

  ngOnInit() {
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

  createEmptyAd(): void {
    this.ads.push(cloneDeep(adInitialState));
    this.adForms.push(this.generateFormField(adInitialState, false));
    this.adPanelsStatus.fill(false);
    this.adPanelsStatus.push(true);
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
      size: new FormControl({value: ad.size, disabled: disabledMode}),
      status: new FormControl(ad.status)
    });

    let state = {};
    if (ad.type === adTypesEnum.IMAGE) {
      state = {name: ad.name, src: ad.url || '', size: ad.size};
    } else {
      state = {name: ad.name, src: ad.url || '',};
    }

    formGroup.controls[adTypeName] = new FormControl(state);
    formGroup.updateValueAndValidity();

    return formGroup;
  }

  fileOverDropArea(isOverDrop, adIndex): void {
    this.imagesStatus.overDrop[adIndex] = isOverDrop;

    if (!isOverDrop && this.uploader.queue[0]) {
      // this.uploadBanner(this.uploader.queue[0], adIndex);
    }
  }

  uploadBanner(form, image, adIndex): void {
    const isUploadedTypeValid = this.isImageTypeChosen(form) ?
      enumToArray(validImageTypes).indexOf(image.file.type) > -1 : enumToArray(validHtmlTypes).indexOf(image.file.type) > -1;
    const isImageSizeValid = image.file.size <= appSettings.MAX_AD_IMAGE_SIZE;

    this.imagesStatus.validation.forEach(
      (validation) => Object.keys(validation).forEach((key) => validation[key] = true)
    );

    this.adjustBannerName(form);

    if (isUploadedTypeValid && isImageSizeValid) {
      this.sendImage(image, adIndex, form);
    } else {
      this.uploader.queue.pop();
      this.imagesStatus.validation[adIndex] = {
        type: isUploadedTypeValid,
        size: isImageSizeValid,
        upload: true
      };
    }
  }

  adjustBannerName(form: FormGroup): void {
    if (form.get('name').dirty === false) {
      let name = `${adTypesEnum[form.get('type').value]} ${adSizesEnum[form.get('size').value]}`;
      const matchingNames = this.adForms.filter(form => form.get('name').value.includes(name));
      if (matchingNames.length > 0) {
        name = `${name} ${matchingNames.length}`
      }
      form.get('name').setValue(name)
    }
  }

  scaleImageToMatchBanner(index) {
    const banners = Array.from(document.querySelectorAll('.banner')) as Array<HTMLElement>;
    const image = banners[index].querySelector('img');
    const bannerWidth = parseInt(this.adSizes[this.adForms[index].get('size').value].split('x')[0]);
    const bannerHeight = parseInt(this.adSizes[this.adForms[index].get('size').value].split('x')[1]);
    const imageWidth = image.offsetWidth;
    const imageHeight = image.offsetHeight;
    const heightRatio = bannerHeight / imageHeight;
    const widthRatio = bannerWidth / imageWidth;

    return heightRatio <= widthRatio ? heightRatio : widthRatio;
  }

  selectProperBannerSize(imageSize: string, index: number) {
    const sizeIndex = this.adSizes.findIndex(size => size === imageSize);
    if (sizeIndex !== -1) {
      this.adForms[index].get('size').setValue(sizeIndex);
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
    image.method = 'POST';
    image.url = `${environment.apiUrl}/campaigns/banner`;
    image.upload();
    image.onProgress = (progress) => {
      this.imagesStatus.upload.processing = true;
      this.imagesStatus.upload.progress = progress;
    };
    image.onSuccess = (res) => {

      const parsedResponse = JSON.parse(res);
      if (this.isImageTypeChosen(form)) {
        this.selectProperBannerSize(parsedResponse.size, adIndex);
        this.ads[adIndex] = {
          ...this.ads[adIndex],
          url: parsedResponse.url,
          imageSize: parsedResponse.size
        };

        this.adForms[adIndex].get('image').setValue({
          name: parsedResponse.name,
          src: parsedResponse.url,
          size: parsedResponse.size
        });
      } else {
        this.ads[adIndex] = {
          ...this.ads[adIndex],
          url: parsedResponse.url,
        };
        this.adForms[adIndex].get('html').setValue({
          src: parsedResponse.url,
          name: parsedResponse.name
        });
      }

      image.onError = () => {
        this.imagesStatus.upload.processing = false;
        this.imagesStatus.validation[adIndex].upload = false;
      };
      image.onComplete = (res) => {
        this.imagesStatus.upload.processing = false;
        this.uploader.queue.pop();
      };
    }
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
      size: this.adForms[adIndex].get('size').value,
      status: this.adForms[adIndex].get('status').value
    });
  }

  setAdType(adIndex): void {
    const adForm = this.adForms[adIndex];
    const adType = adForm.get('type').value;
    const adTypeName = this.adTypes[adType];

    if (adForm.get('image') && adForm.get('image').value.src) {
      const deleteAdSubscription = this.advertiserService.deleteAdImage(this.ads[adIndex].id, this.ads[adIndex].id).subscribe();
      this.subscriptions.push(deleteAdSubscription);

      this.imagesStatus.validation.splice(adIndex, 1);
    }

    this.adTypes.forEach((type) => delete adForm.controls[type]);
    adForm.controls[adTypeName] = new FormControl({src: ''});
    adForm.updateValueAndValidity();
    this.adjustBannerName(adForm);
  }

  setAdSize(adIndex): void {
    const adForm = this.adForms[adIndex];
    const adSize = adForm.get('size').value;
    this.adjustBannerName(adForm);
    const adSizeName = this.adSizes[adSize];
  }

  onSubmit(isDraft: boolean = false): void {
    this.adsSubmitted = true;
    this.changesSaved = true;

    this.adForms.forEach((adForm) => adForm.updateValueAndValidity());
    this.adForms.forEach((form, index) => this.updateAdInfo(index));

    const adsValid = this.adForms.every((adForm) => adForm.valid) &&
      this.adForms.every((adForm, index) => !!this.ads[index].url) &&
      this.imagesStatus.validation.every((validation) => validation.size && validation.type);

    if (adsValid) {
      this.campaign = {
        ...this.campaign,
        ads: this.ads
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
        {queryParams: {step: 4}}
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
        {queryParams: {step: 2}})
    }
  }

  isImageTypeChosen(form): boolean {
    return form.get('type').value === 0
  }

}
