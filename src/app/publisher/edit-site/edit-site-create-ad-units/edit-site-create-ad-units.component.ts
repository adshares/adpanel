import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/first';

import {PublisherService} from 'publisher/publisher.service';
import {AssetHelpersService} from 'common/asset-helpers.service';
import {adTypesEnum, adSizesEnum, adUnitStatusesEnum} from 'models/enum/ad.enum';
import {enumToArray, cloneDeep} from 'common/utilities/helpers';
import {Site} from 'models/site.model';
import {AppState} from 'models/app-state.model';
import {HandleLeaveEditProcess} from 'common/handle-leave-edit-process';
import {AdUnitSize} from 'models/site.model';
import {adUnitInitialState} from 'models/initial-state/ad-unit';
import * as publisherActions from 'store/publisher/publisher.actions';

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
  adUnitSizes: AdUnitSize[];
  filtredAdUnitSizes: AdUnitSize[][] = [];
  adUnitsSubmitted = false;
  adUnitPanelsStatus: boolean[] = [];
  adUnitStatusesEnum = adUnitStatusesEnum;

  constructor(
    private publisherService: PublisherService,
    private assetHelpers: AssetHelpersService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit() {
    this.adUnitSizes = cloneDeep(this.route.snapshot.data.adUnitSizes);
    this.adSizesOptions.unshift('Recommended');
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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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

  selectChosenSize(savedAdUnit, adIndex) {
    const choosedAdSize = this.filtredAdUnitSizes[adIndex].find(
      (filtredAdUnitSize) => filtredAdUnitSize.id === savedAdUnit.size.id
    );

    Object.assign(choosedAdSize, {selected: true});
  }

  generateFormField(adUnit) {
    this.filtredAdUnitSizes.push(cloneDeep(this.adUnitSizes));

    return new FormGroup({
      shortHeadline: new FormControl(adUnit.shortHeadline, Validators.required),
      type: new FormControl(adUnit.type, Validators.required),
      adUnitSizeFilter: new FormControl('Recommended'),
      status: new FormControl(adUnit.status)
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

    const adUnitsValid = this.adUnitForms.every((adForm) => adForm.valid) &&
      this.filtredAdUnitSizes.every(adUnit => adUnit.length === 1 || adUnit.some(unit => unit.selected));

    if (adUnitsValid) {
      this.changesSaved = true;

      const adUnitToSave = this.adUnitForms.map((form, index) => {
        const selectedSize = this.filtredAdUnitSizes[index].find((adUnitSize) => adUnitSize.selected);
        const size = this.filtredAdUnitSizes[index][0];
        return {
          shortHeadline: form.get('shortHeadline').value,
          type: form.get('type').value,
          size: selectedSize || size,
          status: form.get('status').value
        };
      });

      this.store.dispatch(new publisherActions.SaveLastEditedSiteAdUnits(adUnitToSave));
      this.redirectAfterSave(isDraft);
    }
  }

  redirectAfterSave(isDraft) {
    if (!isDraft) {
      this.router.navigate(
        ['/publisher', 'create-site', 'summary'],
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

  removeNewAdUnit(adIndex) {
    this.adUnitForms.splice(adIndex, 1);
    this.adUnitPanelsStatus.splice(adIndex, 1);
  }
}
