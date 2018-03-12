import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { FileUploader } from 'ng2-file-upload';

import * as advertiserActions from 'store/advertiser/advertiser.actions';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { adTypesEnum, adSizesEnum, validImageTypes, adStatusesEnum } from 'models/enum/ad.enum';
import { enumToArray } from 'common/utilities/helpers';
import { adInitialState } from 'models/initial-state/ad';
import { Ad } from 'models/campaign.model';
import { environment } from 'environments/environment';
import { appSettings } from 'app-settings';
import { cloneDeep } from 'common/utilities/helpers';
import { AppState } from 'models/app-state.model';
import { HandleLeaveEditProcess } from 'common/handle-leave-edit-process';
import { Campaign } from 'models/campaign.model';

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
export class EditCampaignCreateAdsComponent extends HandleLeaveEditProcess implements OnInit {
  adForms: FormGroup[] = [];
  adTypes: string[] = enumToArray(adTypesEnum);
  adSizes: string[] = enumToArray(adSizesEnum);
  adStatusesEnum = adStatusesEnum;
  ads: Ad[] = [];
  adsSubmitted = false;
  adPanelsStatus: boolean[] = [];
  uploader: FileUploader = new FileUploader({url: `${environment.apiUrl}/ad`});
  imagesStatus: ImagesStatus = {
    upload: {
      processing: false,
      progress: 0
    },
    overDrop: [],
    validation: []
  };

  constructor(
    private advertiserService: AdvertiserService,
    private router: Router,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit() {
    this.store.select('state', 'advertiser', 'lastEditedCampaign', 'ads')
      .take(1)
      .subscribe((savedAds) => {
        if (savedAds) {
          savedAds.forEach((savedAd, index) => {
            this.adForms.push(this.generateFormField(savedAd));
            this.ads.push(cloneDeep(savedAd));
            this.adPanelsStatus[index] = false;
          });
        } else {
          this.createEmptyAd();
        }
      });
  }

  createEmptyAd() {
    this.ads.push(cloneDeep(adInitialState));
    this.adForms.push(this.generateFormField(adInitialState));
    this.adPanelsStatus.fill(false);
    this.adPanelsStatus.push(true);
  }

  handlePanelExpand(adIndex) {
    this.adPanelsStatus.fill(false);
    this.adPanelsStatus[adIndex] = true;
  }

  generateFormField(ad) {
    const attachmentField = ad.type === adTypesEnum.IMAGE ?
      { name: ad.shortHeadline, src: ad.imageUrl || '', size: ad.size } : (ad.html || '');
    const adTypeName = this.adTypes[ad.type];
    const formGroup =  new FormGroup({
      shortHeadline: new FormControl(ad.shortHeadline, Validators.required),
      type: new FormControl(ad.type),
      size: new FormControl(ad.size),
      status: new FormControl(ad.status)
    });

    formGroup.controls[adTypeName] = new FormControl(attachmentField);
    formGroup.updateValueAndValidity();

    return formGroup;
  }

  fileOverDropArea(isOverDrop, adIndex) {
    this.imagesStatus.overDrop[adIndex] = isOverDrop;

    if (!isOverDrop && this.uploader.queue[0]) {
      this.uploadImage(this.uploader.queue[0], adIndex);
    }
  }

  uploadImage(image, adIndex) {
    const isImageTypeValid = enumToArray(validImageTypes).indexOf(image.file.type) > -1;
    const isImageSizeValid = image.file.size <= appSettings.MAX_AD_IMAGE_SIZE;

    // reset image validation
    this.imagesStatus.validation.forEach(
      (validation) => Object.keys(validation).forEach((key) => validation[key] = true)
    );

    if (isImageTypeValid && isImageSizeValid) {
      this.sendImage(image, adIndex);
    } else {
      this.uploader.queue.pop();
      this.imagesStatus.validation[adIndex] = {
        type: isImageTypeValid,
        size: isImageSizeValid,
        upload: true
      };
    }
  }

  sendImage(image, adIndex) {
    image.method = 'PUT';
    image.withCredentials = false; // needed by mock server
    image.url = `${environment.apiUrl}/ad/${this.ads[adIndex].id}`;
    image.upload();
    image.onProgress = (progress) => {
      this.imagesStatus.upload.processing = true;
      this.imagesStatus.upload.progress = progress;
    };
    image.onSuccess = (res) => {
      const parsedResponse = JSON.parse(res);

      Object.assign(this.ads[adIndex], {
        imageUrl: parsedResponse.imageUrl,
        imageSize: parsedResponse.size
      });

      this.adForms[adIndex].get('image').setValue({
        name: parsedResponse.name,
        src: parsedResponse.imageUrl,
        size: parsedResponse.size
      });
    };
    image.onError = () => this.imagesStatus.validation[adIndex].upload = false;
    image.onComplete = (res) => {
      this.imagesStatus.upload.processing = false;
      this.uploader.queue.pop();
    };
  }

  removeImage(adIndex) {
    this.advertiserService.deleteAdImage(this.ads[adIndex].id)
      .subscribe(() => {
        Object.assign(this.ads[adIndex], { imageUrl: '', imageSize: '' });
        this.adForms[adIndex].get('image').setValue({name: '', src: '', size: ''});
        this.imagesStatus.validation.splice(adIndex, 1);
      });
  }

  saveHtml(adIndex) {
    Object.assign(this.ads[adIndex], {
      html: this.adForms[adIndex].get('html').value,
    });
  }

  updateAdInfo(adIndex) {
    Object.assign(this.ads[adIndex], {
      type: this.adForms[adIndex].get('type').value,
      shortHeadline: this.adForms[adIndex].get('shortHeadline').value,
      size: this.adForms[adIndex].get('size').value,
      status: this.adForms[adIndex].get('status').value
    });
  }

  clearCode(adIndex) {
    this.adForms[adIndex].get('html').setValue('');
    this.ads[adIndex].html = this.adForms[adIndex].get('html').value;
  }

  setAdType(adIndex) {
    const adForm = this.adForms[adIndex];
    const adType = adForm.get('type').value;
    const adTypeName = this.adTypes[adType];

    if (adForm.get('image') && adForm.get('image').value.src) {
      this.advertiserService.deleteAdImage(this.ads[adIndex].id).subscribe();
      this.imagesStatus.validation.splice(adIndex, 1);
    }

    this.adTypes.forEach((type) => delete adForm.controls[type]);
    adForm.controls[adTypeName] = adType === adTypesEnum.IMAGE ?
      new FormControl({src: ''}) : new FormControl('');
    adForm.updateValueAndValidity();
  }

  saveCampaignAds(isDraft) {
    this.adsSubmitted = true;
    this.changesSaved = true;

    this.adForms.forEach((adForm) => adForm.updateValueAndValidity());

    const adsValid =
      this.adForms.every((adForm) => adForm.valid) &&
      this.imagesStatus.validation.every((validation) => validation.size && validation.type);

    if (adsValid) {
      this.adForms.forEach((form, index) => this.updateAdInfo(index));
      this.store.dispatch(new advertiserActions.SaveCampaignAds(this.ads));
      this.redirectAfterSave(isDraft);
    }
  }

  redirectAfterSave(isDraft) {
    if (!isDraft) {
      this.router.navigate(
        ['/advertiser', 'create-campaign', 'summary'],
        { queryParams: { step: 4 } }
      );
    } else {
      this.store.select('state', 'advertiser', 'lastEditedCampaign')
        .take(1)
        .subscribe((campaign: Campaign) => {
          this.advertiserService.saveCampaign(campaign).subscribe();
          this.store.dispatch(new advertiserActions.SaveCampaignAds(this.ads));
          this.store.dispatch(new advertiserActions.AddCampaignToCampaigns(campaign));
          this.router.navigate(['/advertiser', 'dashboard']);
        });
    }
  }

  removeNewAd(adIndex) {
    [this.adForms, this.ads, this.adPanelsStatus, this.imagesStatus.overDrop, this.imagesStatus.validation]
      .forEach((list) => list.splice(adIndex, 1))
  }
}
