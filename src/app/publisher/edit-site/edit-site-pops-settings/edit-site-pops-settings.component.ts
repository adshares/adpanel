import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import 'rxjs/add/operator/first';

import {PublisherService} from 'publisher/publisher.service';
import {adSizesEnum} from 'models/enum/ad.enum';
import {cloneDeep} from 'common/utilities/helpers';
import {AdUnitSize, Site} from 'models/site.model';
import {AppState} from 'models/app-state.model';
import {MatDialog} from "@angular/material";
import {HandleSubscription} from "common/handle-subscription";
import {ClearLastEditedSite, SaveLastEditedSiteAdUnits, UpdateSiteUnits} from "store/publisher/publisher.actions";
import {ErrorResponseDialogComponent} from "common/dialog/error-response-dialog/error-response-dialog.component";
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-site-pops-settings',
  templateUrl: './edit-site-pops-settings.component.html',
  styleUrls: ['./edit-site-pops-settings.component.scss']
})
export class EditSitePopsSettingsComponent extends HandleSubscription implements OnInit {
  faCheck = faCheck;
  faTimes = faTimes;
  popsSettingsForm: FormGroup;
  adSizesEnum = adSizesEnum;
  adUnitSizesArray: AdUnitSize[];
  allAdUnitSizes: AdUnitSize[][] = [];
  adUnitsSubmitted = false;
  adUnitPanelsStatus: boolean[] = [];
  createSiteMode: boolean;
  changesSaved: boolean = false;
  site: Site;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private publisherService: PublisherService,
    private store: Store<AppState>,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    this.createSiteMode = !!this.router.url.match('/create-site/');
    this.adUnitSizesArray = cloneDeep(this.route.snapshot.data.adUnitSizes)
      .filter(item => item.type !== 'pop');

    console.debug(this.adUnitSizesArray);

    this.createForm();
    this.fillFormWithData();
    const lastSiteSubscription = this.store.select('state', 'publisher', 'lastEditedSite')
      .subscribe((site: Site) => {
        this.site = site;
      });
    this.subscriptions.push(lastSiteSubscription);
  }

  createForm(): void {
    const controls = {};
    this.adUnitSizesArray.forEach(adUnitSize => {
      controls[adUnitSize.label] = new FormGroup({
        'selected': new FormControl(false),
        'id': new FormControl(null),
        'size': new FormControl(adUnitSize.size),
      })
    });

    this.popsSettingsForm = new FormGroup(controls);
    // this.getFormDataFromStore();
  }

  fillFormWithData(): void {
    // const lastSiteSubscription = this.store.select('state', 'publisher', 'lastEditedSite')
    //   .first()
    //   .subscribe((lastEditedSite: Site) => {
    //     const siteUrlFilled = this.assetHelpers.redirectIfNameNotFilled(lastEditedSite);
    //
    //     if (!siteUrlFilled) {
    //       this.changesSaved = true;
    //       return;
    //     }
    //
    //     const savedAdUnits = lastEditedSite.adUnits;
    //
    //     if (!!savedAdUnits.length) {
    //       savedAdUnits.forEach((savedAdUnit, index) => {
    //         this.adUnitForms.push(this.generateFormField(savedAdUnit));
    //         this.adUnitPanelsStatus[index] = false;
    //         this.selectChosenSize(savedAdUnit, index);
    //       });
    //     } else {
    //       this.createEmptyAd();
    //     }
    //   });
    // this.subscriptions.push(lastSiteSubscription);
  }

  selectAdUnit(adUnit: AdUnitSize): void {
    console.debug(adUnit);
    const control = this.popsSettingsForm.get(adUnit.label).get('selected');
    console.debug(control.value);
    control.setValue(!control.value);
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
      this.store.dispatch(new ClearLastEditedSite({}));
      this.router.navigate(['/publisher', 'site', siteId]);
    }
  }

  saveAdUnits(isDraft: boolean): void {
    this.changesSaved = true;

    // if (!this.adUnitForms.length) {
    //   this.dialog.open(ErrorResponseDialogComponent, {
    //     data: {
    //       title: 'Section required!',
    //       message: `Create at least one ad unit to submit.`,
    //     }
    //   });
    //   return;
    // }
    //
    // this.adUnitsSubmitted = true;
    // const adUnitsValid = this.adUnitForms.every((adForm) => adForm.valid);
    //
    // if (adUnitsValid) {
    //   this.adUnitsSubmitted = false;
    //   this.store.dispatch(new SaveLastEditedSiteAdUnits(this.adUnitsToSave));
    //   this.redirectAfterSave(isDraft);
    // } else {
    //   this.changesSaved = false;
    // }
  }

  updateAdUnits(): void {
    // const adUnitsValid = this.adUnitForms.every((adForm) => adForm.valid);
    // this.adUnitsSubmitted = true;
    // if (!adUnitsValid) return;
    // this.adUnitsSubmitted = false;
    // const site = {
    //   ...this.site,
    //   adUnits: this.adUnitsToSave,
    // };
    // this.store.dispatch(new UpdateSiteUnits(site));
  }

}
