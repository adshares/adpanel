import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/first';

import {PublisherService} from 'publisher/publisher.service';
import {AssetHelpersService} from 'common/asset-helpers.service';
import {adSizesEnum, adTypesEnum, adUnitStatusesEnum} from 'models/enum/ad.enum';
import {cloneDeep, enumToArray} from 'common/utilities/helpers';
import {AdUnit, AdUnitSize, Site} from 'models/site.model';
import {AppState} from 'models/app-state.model';
import {HandleLeaveEditProcess} from 'common/handle-leave-edit-process';
import {adUnitInitialState} from 'models/initial-state/ad-unit';
import * as publisherActions from 'store/publisher/publisher.actions';
import {ErrorResponseDialogComponent} from "common/dialog/error-response-dialog/error-response-dialog.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-edit-site-create-ad-units',
  templateUrl: './edit-site-create-ad-units.component.html',
  styleUrls: ['./edit-site-create-ad-units.component.scss'],
})
export class EditSiteCreateAdUnitsComponent extends HandleLeaveEditProcess implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  adUnitForms: FormGroup[] = [];
  adTypes: string[] = enumToArray(adTypesEnum);
  adSizesOptions: string[] = enumToArray(adSizesEnum);
  adSizesEnum = adSizesEnum;
  adUnitSizesArray: AdUnitSize[];
  filteredAdUnitSizes: AdUnitSize[][] = [];
  allAdUnitSizes: AdUnitSize[][] = [];
  adUnitsSubmitted = false;
  adUnitPanelsStatus: boolean[] = [];
  adUnitStatusesEnum = adUnitStatusesEnum;
  createSiteMode: boolean;

  constructor(
    private publisherService: PublisherService,
    private assetHelpers: AssetHelpersService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    this.createSiteMode = !!this.router.url.match('/create-site/');
    this.adUnitSizesArray = cloneDeep(this.route.snapshot.data.adUnitSizes);
    this.adSizesOptions.unshift('Recommended');
    this.adSizesOptions.unshift('All');
    const lastSiteSubscription = this.store.select('state', 'publisher', 'lastEditedSite')
      .first()
      .subscribe((lastEditedSite: Site) => {
        console.log('units last', lastEditedSite)
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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  createEmptyAd():void {
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
      (filteredAdUnitSize) => filteredAdUnitSize.type === savedAdUnit.size.type
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

    this.filteredAdUnitSizes[adUnitIndex] = this.adUnitSizesArray.filter((adUnitSize) =>
      filterValue === 'Recommended'
        ? adUnitSize.tags.includes('best')
        : (filterValue === 'All'
          ? true
          : parseInt(adSizesEnum[filterValue]) === adUnitSize.size
        )
    );
  }

  selectAdUnit(adUnit: AdUnitSize, adUnitIndex: number): void {
    this.adUnitForms[adUnitIndex].get('size').setValue(adUnit);
    this.allAdUnitSizes[adUnitIndex].forEach((filteredAdUnit) => {
      filteredAdUnit.selected = filteredAdUnit.type === this.adUnitForms[adUnitIndex].get('size').value.type;
    });

    this.filteredAdUnitSizes[adUnitIndex].forEach(adUnit => {
        adUnit.selected = false;
        if (!!this.allAdUnitSizes[adUnitIndex].find(unit => unit.selected === true && unit.type === adUnit.type)) {
          adUnit.selected = true
        }
      }
    )
  }

  saveAdUnits(isDraft: boolean) {
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

      const adUnitToSave = this.adUnitForms.map((form) => {
        return {
          shortHeadline: form.get('shortHeadline').value,
          type: form.get('type').value,
          size: form.get('size').value,
          status: form.get('status').value
        };
      });
      const lastSiteSubscription = this.store.select('state', 'publisher', 'lastEditedSite')
        .first()
        .subscribe((site: Site) => {
          console.log('usits submit', site)
        });

      this.store.dispatch(new publisherActions.SaveLastEditedSiteAdUnits(adUnitToSave));
      this.redirectAfterSave(isDraft);
    }
  }

  redirectAfterSave(isDraft: boolean): void {

    if (!isDraft) {
      this.router.navigate(
        ['/publisher', this.createSiteMode ? 'create-site' : 'edit-site', 'summary'],
        {queryParams: {step: 4}}
      );

      return;
    }

    const lastSiteSubscription = this.store.select('state', 'publisher', 'lastEditedSite')
      .first()
      .subscribe((site: Site) => {
        this.store.dispatch(new publisherActions.AddSiteToSitesSuccess(site));
        this.router.navigate(['/publisher', 'dashboard']);
      });
    this.subscriptions.push(lastSiteSubscription);
  }

  removeNewAdUnit(adIndex: number): void {
    this.adUnitForms.splice(adIndex, 1);
    this.adUnitPanelsStatus.splice(adIndex, 1);
  }
}
