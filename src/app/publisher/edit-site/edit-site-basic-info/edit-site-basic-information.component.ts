import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {MatDialog} from "@angular/material";
import 'rxjs/add/operator/take';
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {AppState} from 'models/app-state.model';
import * as PublisherActions from 'store/publisher/publisher.actions';
import {cloneDeep} from 'common/utilities/helpers';
import {siteInitialState} from 'models/initial-state/site';
import {Site, SiteLanguage} from 'models/site.model';
import {PublisherService} from "publisher/publisher.service";
import {ErrorResponseDialogComponent} from "common/dialog/error-response-dialog/error-response-dialog.component";

@Component({
  selector: 'app-edit-site-basic-information',
  templateUrl: './edit-site-basic-information.component.html',
  styleUrls: ['./edit-site-basic-information.component.scss']
})
export class EditSiteBasicInformationComponent implements OnInit {
  siteBasicInfoForm: FormGroup;
  languages: SiteLanguage[];
  siteBasicInfoSubmitted = false;
  site: Site = cloneDeep(siteInitialState);
  createSiteMode: boolean;
  goesToSummary: boolean;
  filteredOptions: Observable<object>;
  changesSaved: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private publisherService: PublisherService,
    private store: Store<AppState>,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => this.goesToSummary = !!params.summary);
    this.createSiteMode = !!this.router.url.match('/create-site/');
    this.createForm();
    this.getLanguages();

    this.filteredOptions = this.siteBasicInfoForm.get('primaryLanguage').valueChanges
      .pipe(
        startWith(''),
        map((value: string | SiteLanguage) => typeof value === 'string' ? value : value.name),
        map((val: string) => val ? this.filterOptions(val) : this.languages.slice())
      )
  }

  getLanguages() {
    this.store.select('state', 'publisher', 'languagesList')
      .subscribe((languagesList) => {
        this.languages = languagesList;

        if (!this.languages.length) {
          this.store.dispatch(new PublisherActions.GetLanguagesList());
        } else {
          this.getFormDataFromStore();
        }
      });
  }

  onSubmit() {
    this.siteBasicInfoSubmitted = true;
    return this.createSiteMode ? this.saveSiteBasicInformation() : this.updateSite();
  }

  onStepBack(): void {
    this.createSiteMode ? this.router.navigate(['/publisher', 'dashboard']) :
      this.router.navigate(['/publisher', 'site', this.site.id]);
  }

  saveSiteBasicInformation() {
    if (!this.siteBasicInfoForm.valid) {
      return;
    }

    this.adjustSiteDataBeforeSave();
    const editSiteStep = this.goesToSummary ? 'summary' : 'additional-filtering';
    const param = this.goesToSummary ? 4 : 2;
    this.store.dispatch(new PublisherActions.SaveLastEditedSite(this.site));
    this.changesSaved = true;

    this.router.navigate(
      ['/publisher', 'create-site', editSiteStep],
      {queryParams: {step: param}}
    );
  }

  adjustSiteDataBeforeSave(): void {
    let chosenLanguage = this.siteBasicInfoForm.controls['primaryLanguage'].value;

    if (typeof chosenLanguage === 'string') {
      chosenLanguage = this.getSiteLanguage(chosenLanguage)
    }

    if (!chosenLanguage) {
      this.dialog.open(ErrorResponseDialogComponent, {
        data: {
          title: 'Invalid site language!',
          message: `Fill site language field with correct data and submit`,
        }
      });
      return;
    }

    this.site = {
      ...this.site,
      name: this.siteBasicInfoForm.controls['name'].value,
      primaryLanguage: typeof  chosenLanguage === 'object' ? chosenLanguage.code : chosenLanguage,
    };
  }

  updateSite(): void {
    if (!this.siteBasicInfoForm.valid) {
      return;
    }
    this.changesSaved = true;
    this.adjustSiteDataBeforeSave();
    this.store.dispatch(new PublisherActions.UpdateSite(this.site));
  }

  createForm(): void {
    this.siteBasicInfoForm = new FormGroup({
      name: new FormControl(siteInitialState.name, Validators.required),
      primaryLanguage: new FormControl(siteInitialState.primaryLanguage, Validators.required)
    });
  }

  getFormDataFromStore(): void {
    this.store.select('state', 'publisher', 'lastEditedSite')
      .take(1)
      .subscribe((lastEditedSite) => {
        this.site = cloneDeep(lastEditedSite);
        this.site.primaryLanguage = this.getSiteLanguage(lastEditedSite.primaryLanguage) ?
          this.getSiteLanguage(lastEditedSite.primaryLanguage) :
          this.getSiteLanguage();

        this.siteBasicInfoForm.patchValue(this.site);
      });
  }

  getSiteLanguage(languageCode?: string | SiteLanguage): SiteLanguage {
    let data;

    if (languageCode) {
      data = typeof languageCode === 'string' ? languageCode : languageCode.code;
    } else {
      data = navigator.language.split('-')[0];
    }

    data = data.toLowerCase();

    return this.languages.find(lang => lang.code.toLowerCase() === data || lang.name.toLowerCase() === data);
  }

  displayOption(language?): string {
    return language ? language.name : ''
  }

  filterOptions(val: string): object[] {
    const filterValue = val.toLowerCase();
    return this.languages.filter(option => option.name.toLowerCase().includes(filterValue) || option.code.toLowerCase().includes(filterValue))
  }
}
