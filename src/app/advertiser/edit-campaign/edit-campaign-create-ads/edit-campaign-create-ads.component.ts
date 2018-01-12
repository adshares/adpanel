import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { FileUploader } from 'ng2-file-upload';

import * as AdvertiserAction from '../../../store/advertiser/advertiser.action';
import { AdvertiserService } from '../../advertiser.service';
import { adTypesEnum, adSizesEnum, validImageTypes } from '../../../models/enum/ad.enum'
import { enumToArray } from '../../../common/utilis/helpers';
import { adInitialState } from '../../../models/initial-state/ad';
import { Ad } from '../../../models/campaign.model';
import { environment } from '../../../../environments/environment';
import { appSettings } from '../../../../app-settings/app-settings';
import { cloneDeep } from '../../../common/utilis/helpers';
import { AppState } from '../../../models/app-state.model';
import { HandleLeaveEditProcess } from '../../../common/handle-leave-edit-process';

interface imagesStatus {
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
};

@Component({
  selector: 'app-edit-campaign-create-ads',
  templateUrl: './edit-campaign-create-ads.component.html',
  styleUrls: ['./edit-campaign-create-ads.component.scss'],
})
export class EditCampaignCreateAdsComponent extends HandleLeaveEditProcess implements OnInit {
  adForms: FormGroup[] = [];
  adTypes: string[] = enumToArray(adTypesEnum);
  adSizes: string[] = enumToArray(adSizesEnum);
  ads: Ad[] = [];
  adsSubmitted = false;
  adPanelsStatus: boolean[] = [];
  uploader: FileUploader = new FileUploader({url: `${environment.apiUrl}/ad`});
  imagesStatus: imagesStatus = {
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
    // todo get real ads instead of below one
    this.ads.push(cloneDeep(adInitialState));
    this.createForm();
  }

  createForm() {
    this.ads.forEach((ad) => {
      this.adForms.push(this.generateImageFormField(ad));
    });
  }

  createEmptyAdd() {
    this.ads.push(cloneDeep(adInitialState));
    this.adForms.push(this.generateImageFormField(adInitialState));
  }

  generateImageFormField(ad) {
    return new FormGroup({
      shortHeadline: new FormControl(ad.shortHeadline, Validators.required),
      type: new FormControl(ad.type),
      size: new FormControl(ad.size),
      image: new FormControl({name: '', src: '', size: ''})
    });
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
      this.ads[adIndex].imageUrl = parsedResponse.imageUrl;

      this.adForms[adIndex].controls['image'].setValue({
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
        this.ads[adIndex].imageUrl = '';
        this.adForms[adIndex].controls['image'].setValue({name: '', src: '', size: ''});
        this.imagesStatus.validation.splice(adIndex, 1);
      });
  }

  saveHtml(adIndex) {
    this.ads[adIndex].html = this.adForms[adIndex].controls.html.value;
  }

  clearCode(adIndex) {
    this.adForms[adIndex].controls['html'].setValue('');
    this.ads[adIndex].html = this.adForms[adIndex].controls.html.value;;
  }

  setAdType(adIndex) {
    const adForm = this.adForms[adIndex];
    const adType = adForm.controls.type.value;
    const adTypeName = this.adTypes[adType];

    if (adForm.controls['image'] && adForm.controls['image'].value.src !== '') {
      this.advertiserService.deleteAdImage(this.ads[adIndex].id).subscribe();
      this.imagesStatus.validation.splice(adIndex, 1);
    }

    this.adTypes.forEach((type) => delete adForm.controls[type]);
    adForm.controls[adTypeName] = adType === 0 ? new FormControl({src: ''}) : new FormControl('');
    adForm.updateValueAndValidity();
  }

  saveCampaignAds(isDraft) {
    this.adsSubmitted = true;
    this.changesSaved = true;

    const adsValid =
      this.adForms.every((adForm) => adForm.valid) &&
      this.imagesStatus.validation.every((validation) => validation.size && validation.type);

    if (adsValid) {
      this.router.navigate(['/advertiser/create-campaign/summary'], {queryParams: { step: 4 } });
      this.store.dispatch(new AdvertiserAction.SaveCampaignAds(this.ads));
    }

    if (!isDraft) {
      this.router.navigate(['/advertiser/create-campaign/summary'], {queryParams: { step: 4 } });
    }
  }
}
