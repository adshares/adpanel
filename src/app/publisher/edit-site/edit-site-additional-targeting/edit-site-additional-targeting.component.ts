import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/first';

import * as publisherActions from 'store/publisher/publisher.actions';
import {AppState} from 'models/app-state.model';
import {TargetingOption, TargetingOptionValue} from 'models/targeting-option.model';
import {cloneDeep} from 'common/utilities/helpers';
import {PublisherService} from 'publisher/publisher.service';
import {AssetHelpersService} from 'common/asset-helpers.service';
import {Site} from 'models/site.model';
import {TargetingSelectComponent} from 'common/components/targeting/targeting-select/targeting-select.component';

//TODO in PAN-25 -> replace rest of targeting variables with filtering ones

@Component({
  selector: 'app-edit-site-additional-targeting',
  templateUrl: './edit-site-additional-targeting.component.html',
  styleUrls: ['./edit-site-additional-targeting.component.scss']
})
export class EditSiteAdditionalTargetingComponent implements OnInit, OnDestroy {
  @ViewChild(TargetingSelectComponent) targetingSelectComponent: TargetingSelectComponent;

  goesToSummary: boolean;
  excludePanelOpenState: boolean;
  requirePanelOpenState: boolean;
  site: Site;
  subscriptions: Subscription[] = [];
  targetingOptionsToAdd: TargetingOption[];
  targetingOptionsToExclude: TargetingOption[];
  addedItems: TargetingOptionValue[] = [];
  excludedItems: TargetingOptionValue[] = [];
  createSiteMode: boolean;
  changesSaved: boolean = false;
  filtering;
  isCheckedRequireClassified: boolean;
  isCheckedExcludeUnclassified: boolean;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router,
    private publisherService: PublisherService,
    private assetHelpers: AssetHelpersService
  ) {}

  ngOnInit() {
    this.createSiteMode = !!this.router.url.match('/create-site/');
    this.targetingOptionsToAdd = cloneDeep(this.route.parent.snapshot.data.filteringOptions);
    this.targetingOptionsToExclude = cloneDeep(this.route.parent.snapshot.data.filteringOptions);
    this.route.queryParams.subscribe(params => this.goesToSummary = !!params.summary);
    this.getSiteFromStore();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  updateAddedItems(items) {
    this.addedItems = [...items];
  }

  updateExcludedItems(items) {
    this.excludedItems = [...items];
  }

  onSubmit() {
    return this.createSiteMode ? this.saveSite(false) : this.updateSite();
  }

  onStepBack(): void {
    if (!this.createSiteMode) {
      const siteId = this.site.id;
      this.store.dispatch(new publisherActions.ClearLastEditedSite({}));
      this.router.navigate(['/publisher', 'site', siteId]);
    } else {
      this.router.navigate(['/publisher', 'create-site', 'basic-information'],
        {queryParams: {step: 1}})
    }
  }

  get siteToSave(): Site {
    return {
      ...this.site,
      filtering: {
        requires: [...this.addedItems],
        excludes: [...this.excludedItems],
        requireClassified: this.isCheckedRequireClassified,
        excludeUnclassified: this.isCheckedExcludeUnclassified,
      }
    }
  }

  updateSite() {
    this.changesSaved = true;
    this.store.dispatch(new publisherActions.UpdateSite(this.siteToSave));
  }

  saveSite(isDraft) {
    const chosenTargeting = {
      requires: this.addedItems,
      excludes: this.excludedItems,
      requiredClassified: this.isCheckedRequireClassified,
      excludedUnclassified: this.isCheckedExcludeUnclassified,
    };

    this.changesSaved = true;
    this.store.dispatch(new publisherActions.SaveSiteFiltering(chosenTargeting));

    if (isDraft) {
      this.publisherService.saveAsDraft(this.site);
      return;
    }

    this.router.navigate(
      ['/publisher', 'create-site', 'create-ad-units'],
      {queryParams: {step: 3}}
    );
  }

  getSiteFromStore() {
    const lastSiteSubscription = this.store.select('state', 'publisher', 'lastEditedSite')
      .first()
      .subscribe((lastEditedSite: Site) => {
        this.site = lastEditedSite;
        const siteUrlFilled = this.assetHelpers.redirectIfNameNotFilled(lastEditedSite);

        if (!siteUrlFilled) {
          this.changesSaved = true;
          return;
        }
        const filtering = lastEditedSite.filteringArray;
        this.addedItems = [...filtering.requires];
        this.excludedItems = [...filtering.excludes];
        this.isCheckedRequireClassified = filtering.requireClassified;
        this.isCheckedExcludeUnclassified = filtering.excludeUnclassified;
      });
    this.subscriptions.push(lastSiteSubscription);
  }
}
