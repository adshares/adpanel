import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import 'rxjs/add/operator/take';
import {map, startWith} from "rxjs/operators";
import {AppState} from 'models/app-state.model';
import * as PublisherActions from 'store/publisher/publisher.actions';
import {HandleLeaveEditProcess} from 'common/handle-leave-edit-process';
import {cloneDeep} from 'common/utilities/helpers';
import {siteInitialState} from 'models/initial-state/site';
import {Site, SiteLanguage} from 'models/site.model';
import {Observable} from "rxjs";
import {PublisherService} from "publisher/publisher.service";

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
  filteredOptions: Observable<object>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private publisherService: PublisherService,
    private store: Store<AppState>,
  ) {
    super();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => this.goesToSummary = !!params.summary);
    this.createSiteMode = !!this.router.url.match('/create-site/');

    this.getLanguages();
    this.createForm();
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
        }
      });
  }

  onSubmit() {
    return this.createSiteMode ? this.saveSiteBasicInformation() : this.updateSite();
  }

  saveSiteBasicInformation() {
    this.siteBasicInfoSubmitted = true;
    if (!this.siteBasicInfoForm.valid) {
      return;
    }
    this.adjustSiteDataBeforeSave();
    const editSiteStep = this.goesToSummary ? 'summary' : 'additional-filtering';
    const param = this.goesToSummary ? 4 : 2;
    this.store.dispatch(new PublisherActions.SaveLastEditedSite(this.site));
    this.changesSaved = true;

    this.router.navigate(
      ['/publisher', 'create-site' , editSiteStep],
      {queryParams: {step: param}}
    );
  }

  adjustSiteDataBeforeSave(): void {
    const chosenLanguage = this.siteBasicInfoForm.controls['primaryLanguage'].value;
    this.site = {
      ...this.site,
      name: this.siteBasicInfoForm.controls['name'].value,
      primaryLanguage: typeof  chosenLanguage === 'object' ? chosenLanguage.code : chosenLanguage,
    };
  }

  updateSite() {
    this.siteBasicInfoSubmitted = true;
    if (!this.siteBasicInfoForm.valid) {
      return;
    }
    this.adjustSiteDataBeforeSave();
    this.publisherService.updateSiteData(this.site.id, this.site).subscribe(
      () => {
        this.router.navigate(['/publisher', 'site', this.site.id]);
      },
      (err) => {
        console.error('Error occurred:', err)
      }
    )
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
        this.site.primaryLanguage = this.getSiteLanguage(lastEditedSite.primaryLanguage);
        this.siteBasicInfoForm.patchValue(this.site);
      });
  }

  getSiteLanguage(code: string | SiteLanguage) {
    return this.languages.find(lang => lang.code === code);
  }

  displayOption(language?): string {
    return language ? language.name : ''
  }

  filterOptions(val: string): object[] {
    const filterValue = val.toLowerCase();
    return this.languages.filter(option => option.name.toLowerCase().includes(filterValue) || option.code.toLowerCase().includes(filterValue))
  }
}
