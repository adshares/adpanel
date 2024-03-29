import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import { cloneDeep } from 'common/utilities/helpers';
import { AdUnit, AdUnitMetaData, Site } from 'models/site.model';
import { AppState } from 'models/app-state.model';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import {
  ADD_SITE_TO_SITES_FAILURE,
  AddSiteToSites,
  ClearLastEditedSite,
  SaveLastEditedSiteAdUnits,
  UPDATE_SITE_UNITS_FAILURE,
  UpdateSiteUnits,
} from 'store/publisher/publisher.actions';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { adUnitStatusesEnum, adUnitTypesEnum } from 'models/enum/ad.enum';
import { siteStatusEnum } from 'models/enum/site.enum';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-edit-site-pops-settings',
  templateUrl: './edit-site-pops-settings.component.html',
  styleUrls: ['./edit-site-pops-settings.component.scss'],
})
export class EditSitePopsSettingsComponent extends HandleSubscriptionComponent implements OnInit {
  SMART_LINK_KEY: adUnitTypesEnum.SMART_LINK = adUnitTypesEnum.SMART_LINK;
  faCheck = faCheck;
  faTimes = faTimes;
  popsSettingsForm: FormGroup;
  adUnitSizes: AdUnitMetaData[];
  createSiteMode: boolean;
  changesSaved: boolean = false;
  site: Site;
  smartLinkEnabled: boolean;
  showPlacements: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private actions$: Actions
  ) {
    super();
  }

  ngOnInit(): void {
    this.createSiteMode = !!this.router.url.match('/create-site/');
    this.showPlacements = this.route.snapshot.data.adUnitSizes.some(adUnit => adUnit.type === adUnitTypesEnum.DISPLAY);
    this.adUnitSizes = cloneDeep(this.route.snapshot.data.adUnitSizes).filter(
      item => item.type === adUnitTypesEnum.POP && item.size.startsWith('pop-')
    );
    this.smartLinkEnabled = this.route.snapshot.data.siteOptions.smartLinkEnabled;

    this.createForm();
    const lastSiteSubscription = this.store.select('state', 'publisher', 'lastEditedSite').subscribe((site: Site) => {
      this.site = site;
      site.adUnits
        .filter(item => item.type === adUnitTypesEnum.POP || item.type === this.SMART_LINK_KEY)
        .forEach(adUnit => {
          const control = this.popsSettingsForm.get(adUnit.size);
          control.get('selected').setValue(true);
          control.get('id').setValue(adUnit.id);
        });
    });
    this.subscriptions.push(lastSiteSubscription);
  }

  createForm(): void {
    const controls = {};
    this.adUnitSizes.forEach(adUnitSize => {
      controls[adUnitSize.size] = new FormGroup({
        selected: new FormControl(false),
        id: new FormControl(null),
      });
    });
    controls[this.SMART_LINK_KEY] = new FormGroup({
      selected: new FormControl(false),
      id: new FormControl(null),
    });

    this.popsSettingsForm = new FormGroup(controls, [
      (formGroup: FormGroup) => {
        if (this.showPlacements) {
          return null;
        }
        const anySelected = Object.values(formGroup.value).some((value: any) => value.selected);
        return anySelected ? null : { noAdUnitSelected: true };
      },
    ]);
  }

  selectAdUnit(size: string): void {
    const control = this.popsSettingsForm.get(size).get('selected');
    control.setValue(!control.value);
  }

  onSubmit(): void {
    this.createSiteMode ? this.saveAdUnits(false) : this.updateAdUnits();
  }

  onStepBack(): void {
    if (this.createSiteMode) {
      this.router.navigate(['/publisher', 'create-site', 'basic-information']);
    } else {
      const siteId = this.site.id;
      this.store.dispatch(new ClearLastEditedSite({}));
      this.router.navigate(['/publisher', 'site', siteId]);
    }
  }

  saveAdUnits(isDraft: boolean): void {
    this.changesSaved = true;
    this.store.dispatch(new SaveLastEditedSiteAdUnits(this.adUnitsToSave));
    if (isDraft) {
      this.site = {
        ...this.site,
        status: siteStatusEnum.DRAFT,
      };
      this.store.dispatch(new AddSiteToSites(this.site));
      const errorSubscription = this.actions$.pipe(ofType(ADD_SITE_TO_SITES_FAILURE)).subscribe(() => {
        this.changesSaved = false;
      });
      this.subscriptions.push(errorSubscription);
    } else {
      this.router.navigate([
        '/publisher',
        'create-site',
        this.showPlacements ? 'create-ad-units' : 'additional-filtering',
      ]);
    }
  }

  updateAdUnits(): void {
    this.changesSaved = true;
    const site = {
      ...this.site,
      adUnits: this.adUnitsToSave,
    };
    this.store.dispatch(new UpdateSiteUnits(site));
    const errorSubscription = this.actions$.pipe(ofType(UPDATE_SITE_UNITS_FAILURE)).subscribe(() => {
      this.changesSaved = false;
    });
    this.subscriptions.push(errorSubscription);
  }

  get isFormValid(): boolean {
    return !this.showPlacements && this.popsSettingsForm.valid;
  }

  get adUnitsToSave(): AdUnit[] {
    const units = [
      ...this.site.adUnits.filter(adUnit => {
        return adUnit.type !== adUnitTypesEnum.POP && adUnit.type !== this.SMART_LINK_KEY;
      }),
    ];
    this.adUnitSizes.forEach(adUnit => {
      const control = this.popsSettingsForm.get(adUnit.size);
      if (control.get('selected').value) {
        units.push({
          id: control.get('id').value,
          size: adUnit.size,
          name: adUnit.label,
          type: adUnit.type,
          status: adUnitStatusesEnum.ACTIVE,
          label: adUnit.label,
          tags: adUnit.tags,
        });
      }
    });

    if (this.popsSettingsForm.get(this.SMART_LINK_KEY).get('selected').value) {
      units.push({
        id: this.popsSettingsForm.get(this.SMART_LINK_KEY).get('id').value,
        size: this.SMART_LINK_KEY,
        name: 'SmartLink',
        type: this.SMART_LINK_KEY,
        status: adUnitStatusesEnum.ACTIVE,
        label: 'SmartLink',
        tags: [],
      });
    }
    return units;
  }
}
