import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';

import { AppState } from '../../../models/app-state.model';
import * as PublisherActions from '../../../store/publisher/publisher.actions';
import { HandleLeaveEditProcess } from '../../../common/handle-leave-edit-process';
import { primaryLanguageEnum } from '../../../models/enum/site.enum';
import { cloneDeep, enumToArray } from '../../../common/utilities/helpers';
import { siteInitialState } from '../../../models/initial-state/site';
import { Site } from '../../../models/site.model';

@Component({
  selector: 'app-edit-site-basic-information',
  templateUrl: './edit-site-basic-information.component.html',
  styleUrls: ['./edit-site-basic-information.component.scss']
})
export class EditSiteBasicInformationComponent extends HandleLeaveEditProcess implements OnInit {
  siteBasicInfoForm: FormGroup;
  languages: string[] = enumToArray(primaryLanguageEnum);
  siteBasicInfoSubmitted = false;
  site: Site = cloneDeep(siteInitialState);

  goesToSummary: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => this.goesToSummary = !!params.summary);
    this.createForm();
  }

  saveSiteBasicInformation() {
    this.siteBasicInfoSubmitted = true;

    if (!this.siteBasicInfoForm.valid) {
      return;
    }

    const siteBasicInfoValue = this.siteBasicInfoForm.value;
    const editSiteStep = this.goesToSummary ? 'summary' : 'additional-targeting';
    const param = this.goesToSummary ? 4 : 2;

    Object.assign(this.site, {
      websiteUrl: this.siteBasicInfoForm.controls['websiteUrl'].value,
      primaryLanguage: this.siteBasicInfoForm.controls['primaryLanguage'].value
    });
    this.store.dispatch(new PublisherActions.SaveLastEditedSite(this.site));
    this.changesSaved = true;

    this.router.navigate(
      ['/publisher', 'create-site', editSiteStep],
      { queryParams: { step: param } }
    );
  }

  createForm() {
    this.siteBasicInfoForm = new FormGroup({
      websiteUrl: new FormControl(siteInitialState.websiteUrl, Validators.required),
      primaryLanguage: new FormControl(siteInitialState.primaryLanguage, Validators.required)
    });


    this.getFormDataFromStore();

  }

  getFormDataFromStore() {
    this.store.select('state', 'publisher', 'lastEditedSite')
      .take(1)
      .subscribe((lastEditedSite) => {
        this.site = cloneDeep(lastEditedSite);
        this.siteBasicInfoForm.patchValue(lastEditedSite);
      });
  }
}
