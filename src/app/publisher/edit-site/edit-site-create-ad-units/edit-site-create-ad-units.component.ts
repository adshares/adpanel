import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { PublisherService } from 'publisher/publisher.service';
import { AssetHelpersService } from 'common/asset-helpers.service';
import { cloneDeep } from 'common/utilities/helpers';
import { AdUnit, AdUnitMetaData, Site } from 'models/site.model';
import { AppState } from 'models/app-state.model';
import { adUnitInitialState } from 'models/initial-state/ad-unit';
import {
  ClearLastEditedSite,
  SaveLastEditedSiteAdUnits,
  AddSiteToSites,
  UpdateSiteUnits,
} from 'store/publisher/publisher.actions';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { siteStatusEnum } from 'models/enum/site.enum';
import { adUnitTypesEnum } from 'models/enum/ad.enum';
import { first } from 'rxjs/operators';
import { faPlus, faCheck, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-site-create-poster-units',
  templateUrl: './edit-site-create-ad-units.component.html',
  styleUrls: ['./edit-site-create-ad-units.component.scss'],
})
export class EditSiteCreateAdUnitsComponent extends HandleSubscriptionComponent implements OnInit {
  adUnitForms: FormGroup[] = [];
  adSizesOptions: string[] = [];
  adUnitSizes: AdUnitMetaData[];
  filteredAdUnitSizes: AdUnitMetaData[][] = [];
  allAdUnitSizes: AdUnitMetaData[][] = [];
  adUnitsSubmitted = false;
  adUnitPanelsStatus: boolean[] = [];
  createSiteMode: boolean;
  changesSaved: boolean = false;
  site: Site;
  faPlus = faPlus;
  faCheck = faCheck;
  faTimes = faTimes;
  faTrash = faTrash;

  constructor(
    private publisherService: PublisherService,
    private assetHelpers: AssetHelpersService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit(): void {
    this.createSiteMode = !!this.router.url.match('/create-site/');
    this.adUnitSizes = cloneDeep(this.route.snapshot.data.adUnitSizes).filter(
      item => item.type === adUnitTypesEnum.DISPLAY
    );

    this.getOptions();
    this.fillFormWithData();
    const lastSiteSubscription = this.store.select('state', 'publisher', 'lastEditedSite').subscribe((site: Site) => {
      this.site = site;
    });
    this.subscriptions.push(lastSiteSubscription);
  }

  getOptions(): void {
    const tags = this.adUnitSizes
      .map(unit => unit.tags)
      .reduce((arr1, arr2) => arr1.concat(arr2))
      .filter((item, pos, self) => self.indexOf(item) === pos)
      .filter(item => item !== 'best');
    this.adSizesOptions.push('Recommended');
    this.adSizesOptions.push('All');
    this.adSizesOptions.push(...tags);
  }

  fillFormWithData(): void {
    const lastSiteSubscription = this.store
      .select('state', 'publisher', 'lastEditedSite')
      .pipe(first())
      .subscribe((lastEditedSite: Site) => {
        const siteUrlFilled = this.assetHelpers.redirectIfNameNotFilled(lastEditedSite);

        if (!siteUrlFilled) {
          this.changesSaved = true;
          return;
        }

        const savedAdUnits = lastEditedSite.adUnits.filter(adUnit => {
          return adUnit.type === adUnitTypesEnum.DISPLAY;
        });

        if (savedAdUnits.length > 0) {
          savedAdUnits.forEach((savedAdUnit, index) => {
            this.adUnitForms.push(this.generateFormField(savedAdUnit, true));
            this.adUnitPanelsStatus[index] = false;
            this.unsetSizeIfNotSupported(savedAdUnit, index);
          });
        } else {
          this.createEmptyAd();
        }
      });
    this.subscriptions.push(lastSiteSubscription);
  }

  createEmptyAd(): void {
    this.adUnitsSubmitted = false;
    this.adUnitForms.push(this.generateFormField(adUnitInitialState));
    this.adUnitPanelsStatus.fill(false);
    this.adUnitPanelsStatus.push(true);
  }

  handlePanelExpand(adIndex: number): void {
    this.adUnitPanelsStatus.fill(false);
    this.adUnitPanelsStatus[adIndex] = true;
  }

  unsetSizeIfNotSupported(savedAdUnit: AdUnit, adIndex: number): void {
    const chosenAdSize = this.filteredAdUnitSizes[adIndex].find(adUnit => adUnit.size === savedAdUnit.size);
    if (undefined === chosenAdSize) {
      this.adUnitForms[adIndex].patchValue({ size: undefined });
    }
  }

  generateFormField(adUnit: Partial<AdUnit>, saved: boolean = false): FormGroup {
    this.filteredAdUnitSizes.push(cloneDeep(this.adUnitSizes));
    this.allAdUnitSizes.push(cloneDeep(this.adUnitSizes));

    const adUnitMetaData = this.adUnitSizes.find(adUnitMetaData => adUnitMetaData.size === adUnit.size);

    return new FormGroup({
      name: new FormControl(adUnit.name, Validators.required),
      type: new FormControl(adUnit.type, Validators.required),
      adUnitSizeFilter: new FormControl('All'),
      status: new FormControl(adUnit.status),
      size: new FormControl(adUnit.size, Validators.required),
      label: new FormControl(adUnit.label, Validators.required),
      tags: new FormControl(adUnitMetaData?.tags, Validators.required),
      id: new FormControl(adUnit.id),
      saved: new FormControl(saved),
    });
  }

  onAdUnitSizeFilterChange(adUnitIndex: number): void {
    const filterValue = this.adUnitForms[adUnitIndex].get('adUnitSizeFilter').value;

    this.filteredAdUnitSizes[adUnitIndex] = this.adUnitSizes.filter(adUnitSize => {
      if (filterValue === 'Recommended') {
        return adUnitSize.tags.includes('best');
      } else if (filterValue === 'All') {
        return true;
      } else {
        return adUnitSize.tags.includes(filterValue);
      }
    });
  }

  selectAdUnit(adUnit: AdUnitMetaData, adUnitIndex: number): void {
    this.adUnitForms[adUnitIndex].get('label').setValue(adUnit.label);
    this.adUnitForms[adUnitIndex].get('size').setValue(adUnit.size);
    this.adUnitForms[adUnitIndex].get('tags').setValue(adUnit.tags);
    this.adUnitForms[adUnitIndex].get('type').setValue(adUnit.type);
    this.adjustAdUnitName(adUnitIndex, adUnit.label);
  }

  adjustAdUnitName(index: number, name: string): void {
    if (this.adUnitForms[index].get('name').dirty === true) {
      return;
    }
    this.adUnitForms[index].get('name').setValue(name);
  }

  onSubmit(): void {
    return this.createSiteMode ? this.saveAdUnits(false) : this.updateAdUnits();
  }

  onStepBack(): void {
    if (this.createSiteMode) {
      this.router.navigate(['/publisher', 'create-site', 'pops-settings']);
    } else {
      const siteId = this.site.id;
      this.store.dispatch(new ClearLastEditedSite({}));
      this.router.navigate(['/publisher', 'site', siteId]);
    }
  }

  updateAdUnits(): void {
    const adUnitsValid = this.adUnitForms.every(adForm => adForm.valid);
    this.adUnitsSubmitted = true;
    if (!adUnitsValid) return;
    this.adUnitsSubmitted = false;
    const site = {
      ...this.site,
      adUnits: this.adUnitsToSave,
    };
    this.store.dispatch(new UpdateSiteUnits(site));
  }

  get adUnitsToSave(): AdUnit[] {
    const units = [
      ...this.site.adUnits.filter(adUnit => {
        return adUnit.type !== adUnitTypesEnum.DISPLAY;
      }),
    ];

    this.adUnitForms.forEach(form => {
      units.push({
        name: form.get('name').value,
        type: form.get('type').value,
        size: form.get('size').value,
        label: form.get('label').value,
        tags: form.get('tags').value,
        status: form.get('status').value,
        id: form.get('id').value,
      });
    });

    return units;
  }

  saveAdUnits(isDraft: boolean): void {
    this.changesSaved = true;
    this.adUnitsSubmitted = true;
    const adUnitsValid = this.adUnitForms.every(adForm => adForm.valid);
    if (adUnitsValid) {
      this.adUnitsSubmitted = false;
      this.store.dispatch(new SaveLastEditedSiteAdUnits(this.adUnitsToSave));
      this.redirectAfterSave(isDraft);
    } else {
      this.changesSaved = false;
    }
  }

  redirectAfterSave(isDraft: boolean): void {
    this.changesSaved = false;
    if (isDraft) {
      this.site = {
        ...this.site,
        status: siteStatusEnum.DRAFT,
      };
      this.store.dispatch(new AddSiteToSites(this.site));
      return;
    }
    this.router.navigate(['/publisher', 'create-site', 'additional-filtering']);
  }

  removeAdUnit(adIndex: number): void {
    this.adUnitForms.splice(adIndex, 1);
    this.adUnitPanelsStatus.splice(adIndex, 1);
  }
}
