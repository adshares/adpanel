import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import { PublisherService } from 'publisher/publisher.service';
import { cloneDeep } from 'common/utilities/helpers';
import { AdUnit, AdUnitMetaData, Site } from 'models/site.model';
import { AppState } from 'models/app-state.model';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import {
  AddSiteToSites,
  ClearLastEditedSite,
  SaveLastEditedSiteAdUnits,
  UpdateSiteUnits,
} from 'store/publisher/publisher.actions';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AssetHelpersService } from 'common/asset-helpers.service';
import { adUnitStatusesEnum, adUnitTypesEnum } from 'models/enum/ad.enum';
import { siteStatusEnum } from 'models/enum/site.enum';

@Component({
  selector: 'app-edit-site-pops-settings',
  templateUrl: './edit-site-pops-settings.component.html',
  styleUrls: ['./edit-site-pops-settings.component.scss'],
})
export class EditSitePopsSettingsComponent extends HandleSubscriptionComponent implements OnInit {
  faCheck = faCheck;
  faTimes = faTimes;
  popsSettingsForm: FormGroup;
  adUnitSizes: AdUnitMetaData[];
  createSiteMode: boolean;
  changesSaved: boolean = false;
  site: Site;

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
      item => item.type === adUnitTypesEnum.POP
    );

    this.createForm();
    const lastSiteSubscription = this.store.select('state', 'publisher', 'lastEditedSite').subscribe((site: Site) => {
      this.site = site;
      site.adUnits
        .filter(item => item.type === adUnitTypesEnum.POP)
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

    this.popsSettingsForm = new FormGroup(controls);
  }

  selectAdUnit(size: string): void {
    const control = this.popsSettingsForm.get(size).get('selected');
    control.setValue(!control.value);
  }

  onSubmit(): void {
    return this.createSiteMode ? this.saveAdUnits(false) : this.updateAdUnits();
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
    } else {
      this.router.navigate(['/publisher', 'create-site', 'create-ad-units']);
    }
    this.changesSaved = false;
  }

  updateAdUnits(): void {
    const site = {
      ...this.site,
      adUnits: this.adUnitsToSave,
    };
    this.store.dispatch(new UpdateSiteUnits(site));
  }

  get adUnitsToSave(): AdUnit[] {
    const units = [
      ...this.site.adUnits.filter(adUnit => {
        return adUnit.type !== adUnitTypesEnum.POP;
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

    return units;
  }
}
