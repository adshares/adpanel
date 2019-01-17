import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/first';

import * as publisherActions from 'store/publisher/publisher.actions';
import {AppState} from 'models/app-state.model';
import {TargetingOption, TargetingOptionValue} from 'models/targeting-option.model';
import {cloneDeep} from 'common/utilities/helpers';
import {HandleLeaveEditProcess} from 'common/handle-leave-edit-process';
import {PublisherService} from 'publisher/publisher.service';
import {AssetHelpersService} from 'common/asset-helpers.service';
import {Site} from 'models/site.model';
import {TargetingSelectComponent} from 'common/components/targeting/targeting-select/targeting-select.component';
import {parseTargetingOptionsToArray} from "common/components/targeting/targeting.helpers";

//TODO in PAN-25 -> replace rest of targeting variables with filtering ones

@Component({
  selector: 'app-edit-site-additional-targeting',
  templateUrl: './edit-site-additional-targeting.component.html',
  styleUrls: ['./edit-site-additional-targeting.component.scss']
})
export class EditSiteAdditionalTargetingComponent extends HandleLeaveEditProcess implements OnInit, OnDestroy {
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
  filtering;
  filteringOptions;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router,
    private publisherService: PublisherService,
    private assetHelpers: AssetHelpersService
  ) {
    super();
  }

  ngOnInit() {
    this.createSiteMode = !!this.router.url.match('/create-site/');
    this.targetingOptionsToAdd = cloneDeep(this.route.parent.snapshot.data.targetingOptions);
    this.targetingOptionsToExclude = cloneDeep(this.route.parent.snapshot.data.targetingOptions);
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
        excludes: [...this.excludedItems]
      }
    }
  }

  updateSite() {
    this.changesSaved = true;
    const updateSubscription = this.publisherService.updateSiteFiltering(this.siteToSave.id, this.siteToSave)
      .subscribe(
        () => {
          const siteId = this.site.id;
          this.store.dispatch(new publisherActions.ClearLastEditedSite());
          this.router.navigate(['/publisher', 'site', siteId]);
        }
      );
    this.subscriptions.push(updateSubscription);

  }

  saveSite(isDraft) {
    const chosenTargeting = {
      requires: this.addedItems,
      excludes: this.excludedItems
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
        this.getFiltering(lastEditedSite);

        if (!siteUrlFilled) {
          this.changesSaved = true;
          return;
        }
      });
    this.subscriptions.push(lastSiteSubscription);
  }

  getFiltering(site) {
    const filteringSubscription = this.store.select('state', 'publisher', 'filteringCriteria')
      .subscribe((filteringOptions) => {
        this.filteringOptions = filteringOptions;
        this.filtering = this.createSiteMode ? site.filtering : parseTargetingOptionsToArray(site.filtering, this.filteringOptions);

        this.addedItems = [...this.filtering.requires];
        this.excludedItems = [...this.filtering.excludes];
        if (!filteringOptions.length) {
          this.store.dispatch(new publisherActions.GetFilteringCriteria());
        }
      });
    this.subscriptions.push(filteringSubscription);
  }

}
