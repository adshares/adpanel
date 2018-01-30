import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as PublisherAction from '../../../store/publisher/publisher.actions';
import { PublisherService } from '../../publisher.service';
import { adTypesEnum, adSizesEnum } from '../../../models/enum/ad.enum'
import { enumToArray, cloneDeep } from '../../../common/utilities/helpers';
import { Site } from '../../../models/site.model';
import { AppState } from '../../../models/app-state.model';
import { HandleLeaveEditProcess } from '../../../common/handle-leave-edit-process';
import { AdUnitSize } from '../../../models/site.model';
import { adUnitInitialState } from '../../../models/initial-state/ad-unit';

@Component({
  selector: 'app-edit-site-create-ad-units',
  templateUrl: './edit-site-create-ad-units.component.html',
  styleUrls: ['./edit-site-create-ad-units.component.scss'],
})
export class EditSiteCreateAdUnitsComponent extends HandleLeaveEditProcess implements OnInit {
  adUnitForms: FormGroup[] = [];
  adTypes: string[] = enumToArray(adTypesEnum);
  adSizesOptions: string[] = enumToArray(adSizesEnum);
  adSizesEnum = adSizesEnum;
  adUnitSizes: AdUnitSize[];
  filtredAdUnitSizes: AdUnitSize[][] = [];
  adUnitsSubmitted = false;
  adUnitPanelsStatus: boolean[] = [];

  constructor(
    private publisherService: PublisherService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit() {
    this.adUnitSizes = cloneDeep(this.route.snapshot.data.adUnitSizes);
    this.adSizesOptions.unshift('Recommended');
    this.store.select('state', 'publisher', 'lastEditedSite', 'adUnits')
      .take(1)
      .subscribe((savedAdUnits) => {
        if (savedAdUnits) {
          savedAdUnits.forEach((savedAdUnit, index) => {
            this.adUnitForms.push(this.generateFormField(savedAdUnit));
            this.adUnitPanelsStatus[index] = false;
            this.selectChoosedSize(savedAdUnit, index);
          });
        } else {
          this.createEmptyAd();
        }
      });
  }

  createEmptyAd() {
    this.adUnitForms.push(this.generateFormField(adUnitInitialState));
    this.adUnitPanelsStatus.fill(false);
    this.adUnitPanelsStatus.push(true);
  }

  handlePanelExpand(adIndex) {
    this.adUnitPanelsStatus.fill(false);
    this.adUnitPanelsStatus[adIndex] = true;
  }

  selectChoosedSize(savedAdUnit, adIndex) {
    const choosedAdSize = this.filtredAdUnitSizes[adIndex].find(
      (filtredAdUnitSize) => filtredAdUnitSize.id === savedAdUnit.size.id
    );

    Object.assign(choosedAdSize, { selected: true });
  }

  generateFormField(adUnit) {
    this.filtredAdUnitSizes.push(cloneDeep(this.adUnitSizes));

    return  new FormGroup({
      shortHeadline: new FormControl(adUnit.shortHeadline, Validators.required),
      type: new FormControl(adUnit.type, Validators.required),
      adUnitSizeFilter: new FormControl('Recommended')
    });
  }

  onAdUnitSizeFilterChange(adUnitIindex) {
    const filterValue = this.adUnitForms[adUnitIindex].get('adUnitSizeFilter').value;

    this.filtredAdUnitSizes[adUnitIindex] = this.adUnitSizes.filter((adUnitSize) =>
      filterValue === 'Recommended' ? true : parseInt(adSizesEnum[filterValue]) === adUnitSize.size
    );
  }

  selectAdUnit(adUnit, adUnitIindex) {
    this.filtredAdUnitSizes[adUnitIindex].forEach((filtredAdUnit) => {
      filtredAdUnit.selected = false;
    });

    adUnit.selected = true;
  }

  saveAdUnits(isDraft) {
    this.adUnitsSubmitted = true;

    const adUnitsValid =
      this.adUnitForms.every((adForm) => adForm.valid) &&
      this.filtredAdUnitSizes.every(
        (filtedAdUnitSizes) => filtedAdUnitSizes.some((adUnitSize) => adUnitSize.selected)
      );

    if (adUnitsValid) {
      this.changesSaved = true;

      const adUnitToSave = this.adUnitForms.map((form, index) => {
        return {
          shortHeadline: form.get('shortHeadline').value,
          type: form.get('type').value,
          size: this.filtredAdUnitSizes[index].find((adUnitSize) => adUnitSize.selected)
        };
      });

      this.store.dispatch(new PublisherAction.SaveLastEditedSiteAdUnits(adUnitToSave));
      this.redirectAfterSave(isDraft);
    }
  }

  redirectAfterSave(isDraft) {
    if (!isDraft) {
      this.router.navigate(
        ['/publisher', 'create-site', 'summary'],
        { queryParams: { step: 4 } }
      );
    } else {
      this.store.select('state', 'publisher', 'lastEditedSite')
        .take(1)
        .subscribe((site: Site) => {
          this.publisherService.saveSite(site).subscribe();
          this.store.dispatch(new PublisherAction.AddSiteToSites(site));
          this.router.navigate(['/publisher', 'dashboard']);
        });
    }
  }
}
