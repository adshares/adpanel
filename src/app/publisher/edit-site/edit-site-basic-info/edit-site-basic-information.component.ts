import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';

import { AppState } from 'models/app-state.model';
import * as PublisherActions from 'store/publisher/publisher.actions';
import { HandleLeaveEditProcess } from 'common/handle-leave-edit-process';
import { cloneDeep } from 'common/utilities/helpers';
import { siteInitialState } from 'models/initial-state/site';
import { Site, SiteLanguage } from 'models/site.model';

@Component({
  selector: 'app-edit-site-basic-information',
  templateUrl: './edit-site-basic-information.component.html',
  styleUrls: ['./edit-site-basic-information.component.scss']
})
export class EditSiteBasicInformationComponent extends HandleLeaveEditProcess implements OnInit {
  siteBasicInfoForm: FormGroup;
  languages: SiteLanguage[];
  siteBasicInfoSubmitted = false;
  site: Site = cloneDeep(siteInitialState);
  createSiteMode: boolean;
  goesToSummary: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
  ) {
    super();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => this.goesToSummary = !!params.summary);
    this.createSiteMode = !!this.router.url.match('/create-site/');
    this.createForm();
    this.getLanguages();
  }

  getLanguages() {
    this.store.select('state', 'publisher', 'languagesList')
      .subscribe((languagesList) => {
        this.languages = languagesList;

        if (!this.languages.length) {
          this.store.dispatch(new PublisherActions.GetLanguagesList());
        }
      });
  }

  saveSiteBasicInformation() {
    this.siteBasicInfoSubmitted = true;
    if (!this.siteBasicInfoForm.valid) {
      return;
    }

    const editSiteStep = this.goesToSummary ? 'summary' : 'additional-filtering';
    const param = this.goesToSummary ? 4 : 2;

    this.site = {
      ...this.site,
      name: this.siteBasicInfoForm.controls['name'].value,
      primaryLanguage: this.siteBasicInfoForm.controls['primaryLanguage'].value,
    };

    this.store.dispatch(new PublisherActions.SaveLastEditedSite(this.site));
    this.changesSaved = true;

    this.router.navigate(
      ['/publisher', this.createSiteMode ? 'create-site' : 'edit-site', editSiteStep],
      {queryParams: {step: param}}
    );
  }

  createForm() {
    this.siteBasicInfoForm = new FormGroup({
      name: new FormControl(siteInitialState.name, [
        Validators.required
      ]),
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
