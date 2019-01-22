import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/first';

import {PublisherService} from 'publisher/publisher.service';
import {AssetHelpersService} from 'common/asset-helpers.service';
import {adSizesEnum, adTypesOptions, adUnitStatusesEnum} from 'models/enum/ad.enum';
import {cloneDeep, enumToArray} from 'common/utilities/helpers';
import {AdUnit, AdUnitSize, Site} from 'models/site.model';
import {AppState} from 'models/app-state.model';
import {adUnitInitialState} from 'models/initial-state/ad-unit';
import * as publisherActions from 'store/publisher/publisher.actions';
import {ErrorResponseDialogComponent} from "common/dialog/error-response-dialog/error-response-dialog.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-edit-site-create-ad-units',
  templateUrl: './edit-site-create-ad-units.component.html',
  styleUrls: ['./edit-site-create-ad-units.component.scss'],
})
export class EditSiteCreateAdUnitsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  adUnitForms: FormGroup[] = [];
  adTypes: string[] = adTypesOptions;
  adSizesOptions: string[] = [];
  adSizesEnum = adSizesEnum;
  adUnitSizesArray: AdUnitSize[];
  filteredAdUnitSizes: AdUnitSize[][] = [];
  allAdUnitSizes: AdUnitSize[][] = [];
  adUnitsSubmitted = false;
  adUnitPanelsStatus: boolean[] = [];
  adUnitStatusesEnum = adUnitStatusesEnum;
  createSiteMode: boolean;
  site: Site;

  constructor(
    private publisherService: PublisherService,
    private assetHelpers: AssetHelpersService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.createSiteMode = !!this.router.url.match('/create-site/');
    this.adUnitSizesArray = cloneDeep(this.route.snapshot.data.adUnitSizes);

    this.getOptions();
    this.fillFormWithData();
    const lastSiteSubscription = this.store.select('state', 'publisher', 'lastEditedSite')
      .subscribe((site: Site) => {
        this.site = site;
      });
    this.subscriptions.push(lastSiteSubscription);
  }

  getOptions(): void {
    const tags = this.adUnitSizesArray
      .map(unit => unit.tags)
      .reduce((arr1, arr2) => arr1.concat(arr2))
      .filter((item, pos, self) => self.indexOf(item) === pos)
      .filter(item => item !== 'best');
    this.adSizesOptions.push('Recommended');
    this.adSizesOptions.push('All');
    this.adSizesOptions.push(...tags);

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  fillFormWithData(): void {
    const lastSiteSubscription = this.store.select('state', 'publisher', 'lastEditedSite')
      .first()
      .subscribe((lastEditedSite: Site) => {
        const siteUrlFilled = this.assetHelpers.redirectIfNameNotFilled(lastEditedSite);

        if (!siteUrlFilled) {
          this.changesSaved = true;
          return;
        }

        const savedAdUnits = lastEditedSite.adUnits;

        if (savedAdUnits) {
          savedAdUnits.forEach((savedAdUnit, index) => {
            this.adUnitForms.push(this.generateFormField(savedAdUnit));
            this.adUnitPanelsStatus[index] = false;
            this.selectChosenSize(savedAdUnit, index);
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

  selectChosenSize(savedAdUnit: AdUnit, adIndex: number): void {
    const chosenAdSize = this.filteredAdUnitSizes[adIndex].find(
      (filteredAdUnitSize) => filteredAdUnitSize.label === savedAdUnit.size.label
    );
    Object.assign(chosenAdSize, {selected: true});
  }

  generateFormField(adUnit: Partial<AdUnit>): FormGroup {
    this.filteredAdUnitSizes.push(cloneDeep(this.adUnitSizesArray));
    this.allAdUnitSizes.push(cloneDeep(this.adUnitSizesArray));

    return new FormGroup({
      shortHeadline: new FormControl(adUnit.shortHeadline, Validators.required),
      type: new FormControl(adUnit.type, Validators.required),
      adUnitSizeFilter: new FormControl('All'),
      status: new FormControl(adUnit.status),
      size: new FormControl(adUnit.size, Validators.required)
    });
  }

  onAdUnitSizeFilterChange(adUnitIndex: number): void {
    const filterValue = this.adUnitForms[adUnitIndex].get('adUnitSizeFilter').value;

    this.filteredAdUnitSizes[adUnitIndex] = this.adUnitSizesArray.filter((adUnitSize) => {
      if (filterValue === 'Recommended') {
        return adUnitSize.tags.includes('best')
      } else if (filterValue === 'All') {
        return true
      } else {
        return adUnitSize.tags.includes(filterValue)
      }
    });
  }

  selectAdUnit(adUnit: AdUnitSize, adUnitIndex: number): void {
    this.adUnitForms[adUnitIndex].get('size').setValue(adUnit);
  }

  onSubmit(): void {
    return this.createSiteMode ? this.saveAdUnits(false) : this.updateAdUnits();
  }

  onStepBack(): void {
    if (this.createSiteMode) {
      this.router.navigate(['/publisher', 'create-site', 'additional-filtering'],
        {queryParams: {step: 2}})
    } else {
      const siteId = this.site.id;
      this.store.dispatch(new publisherActions.ClearLastEditedSite({}));
      this.router.navigate(['/publisher', 'site', siteId]);
    }
  }

  updateAdUnits(): void {
    this.adUnitsSubmitted = true;

    const adUnitsValid = this.adUnitForms.every((adForm) => adForm.valid);
    if (!adUnitsValid) return;

    this.store.dispatch(new publisherActions.SaveLastEditedSiteAdUnits(this.adUnitsToSave));

    const updateSubscription = this.publisherService.updateSiteData(this.site.id, this.site)
      .subscribe(
        () => {
          const siteId = this.site.id;
          this.store.dispatch(new publisherActions.AddSiteToSitesSuccess(this.site));
          this.store.dispatch(new publisherActions.ClearLastEditedSite({}));
          this.router.navigate(['/publisher', 'site', siteId]);
        },
        (err) => {
          console.error(`Error occured: ${err}`)
        }
      );
    this.subscriptions.push(updateSubscription);
  }

  get adUnitsToSave(): AdUnit[] {
    return this.adUnitForms.map((form) => {
      return {
        shortHeadline: form.get('shortHeadline').value,
        type: form.get('type').value,
        size: form.get('size').value,
        status: form.get('status').value
      };
    });
  }

  saveAdUnits(isDraft: boolean): void {
    if (!this.adUnitForms.length) {
      this.dialog.open(ErrorResponseDialogComponent, {
        data: {
          title: 'Section required!',
          message: `Create at least one ad unit to submit.`,
        }
      });
      return;
    }

    this.adUnitsSubmitted = true;
    const adUnitsValid = this.adUnitForms.every((adForm) => adForm.valid);

    if (adUnitsValid) {
      this.changesSaved = true;
      this.store.dispatch(new publisherActions.SaveLastEditedSiteAdUnits(this.adUnitsToSave));
      this.redirectAfterSave(isDraft);
    }
  }

  redirectAfterSave(isDraft: boolean): void {
    if (isDraft) {
      this.publisherService.saveAsDraft(this.site);
      return;
    }

    this.router.navigate(
      ['/publisher', this.createSiteMode ? 'create-site' : 'edit-site', 'summary'],
      {queryParams: {step: 4}}
    );
  }

  removeNewAdUnit(adIndex: number): void {
    this.adUnitForms.splice(adIndex, 1);
    this.adUnitPanelsStatus.splice(adIndex, 1);
  }
}
