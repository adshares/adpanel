import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import {
  ADD_SITE_TO_SITES_FAILURE,
  AddSiteToSites,
  ClearLastEditedSite,
  SaveSiteFiltering,
  SaveSiteOptions,
  UPDATE_SITE_FAILURE,
  UpdateSite,
} from 'store/publisher/publisher.actions';
import { AppState } from 'models/app-state.model';
import { TargetingOption, TargetingOptionValue } from 'models/targeting-option.model';
import { cloneDeep } from 'common/utilities/helpers';
import { AssetHelpersService } from 'common/asset-helpers.service';
import { Site } from 'models/site.model';
import { parseTargetingForBackend } from 'common/components/targeting/targeting.helpers';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { siteStatusEnum } from 'models/enum/site.enum';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Actions, ofType } from '@ngrx/effects';
import { adUnitTypesEnum } from 'models/enum/ad.enum'

@Component({
  selector: 'app-edit-site-additional-targeting',
  templateUrl: './edit-site-additional-targeting.component.html',
  styleUrls: ['./edit-site-additional-targeting.component.scss'],
})
export class EditSiteAdditionalTargetingComponent extends HandleSubscriptionComponent implements OnInit {
  excludePanelOpenState: boolean;
  requirePanelOpenState: boolean;
  site: Site;
  targetingOptionsToAdd: TargetingOption[] = [];
  targetingOptionsToExclude: TargetingOption[] = [];
  addedItems: TargetingOptionValue[] = [];
  excludedItems: TargetingOptionValue[] = [];
  createSiteMode: boolean;
  changesSaved: boolean = false;
  showRequiresSection: boolean = false;
  isCheckedOnlyAcceptedBanners: boolean;
  isCheckedOnlyDirectDeals: boolean;
  faQuestionCircle = faQuestionCircle;
  showPlacements: boolean;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router,
    private assetHelpers: AssetHelpersService,
    private actions$: Actions
  ) {
    super();
  }

  ngOnInit(): void {
    this.createSiteMode = !!this.router.url.match('/create-site/');
    this.showPlacements = this.route.parent.snapshot.data.adUnitSizes.some(
      adUnit => adUnit.type === adUnitTypesEnum.DISPLAY
    );
    this.targetingOptionsToAdd = cloneDeep(this.route.parent.snapshot.data.filteringOptions);
    this.targetingOptionsToExclude = cloneDeep(this.route.parent.snapshot.data.filteringOptions);
    this.getSiteFromStore();
  }

  updateAddedItems(items): void {
    this.addedItems = [...items];
  }

  updateExcludedItems(items): void {
    this.excludedItems = [...items];
  }

  onSubmit(): void {
    return this.createSiteMode ? this.saveSite(false) : this.updateSite();
  }

  onStepBack(): void {
    if (!this.createSiteMode) {
      const siteId = this.site.id;
      this.store.dispatch(new ClearLastEditedSite());
      this.router.navigate(['/publisher', 'site', siteId]);
    } else {
      this.router.navigate(['/publisher', 'create-site', this.getPreviousPath()]);
    }
  }

  private getPreviousPath(): string {
    if ('metaverse' === this.site.medium) {
      return 'basic-information';
    }
    return this.showPlacements ? 'create-ad-units' : 'pops-settings';
  }

  get siteToSave(): Site {
    const filtering = {
      requires: [...this.addedItems],
      excludes: [...this.excludedItems],
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { adUnits, ...reducedSite } = this.site;
    return {
      ...reducedSite,
      filtering: parseTargetingForBackend(filtering),
      onlyAcceptedBanners: this.isCheckedOnlyAcceptedBanners,
      onlyDirectDeals: this.isCheckedOnlyDirectDeals,
    };
  }

  updateSite(): void {
    this.changesSaved = true;
    this.store.dispatch(new UpdateSite(this.siteToSave));
    const errorSubscription = this.actions$.pipe(ofType(UPDATE_SITE_FAILURE)).subscribe(() => {
      this.changesSaved = false;
    });
    this.subscriptions.push(errorSubscription);
  }

  saveSite(isDraft): void {
    const chosenTargeting = {
      requires: this.addedItems,
      excludes: this.excludedItems,
    };

    this.changesSaved = true;

    if (isDraft) {
      this.site = {
        ...this.site,
        onlyAcceptedBanners: this.isCheckedOnlyAcceptedBanners,
        onlyDirectDeals: this.isCheckedOnlyDirectDeals,
        status: siteStatusEnum.DRAFT,
        filteringArray: chosenTargeting,
      };
      this.store.dispatch(new AddSiteToSites(this.site));
      const errorSubscription = this.actions$.pipe(ofType(ADD_SITE_TO_SITES_FAILURE)).subscribe(() => {
        this.changesSaved = false;
      });
      this.subscriptions.push(errorSubscription);
    } else {
      this.store.dispatch(new SaveSiteFiltering(chosenTargeting));
      this.store.dispatch(
        new SaveSiteOptions({
          onlyAcceptedBanners: this.isCheckedOnlyAcceptedBanners,
          onlyDirectDeals: this.isCheckedOnlyDirectDeals,
        })
      );
      this.router.navigate(['/publisher', 'create-site', 'summary']);
    }
  }

  getSiteFromStore(): void {
    const lastSiteSubscription = this.store
      .select('state', 'publisher', 'lastEditedSite')
      .pipe(first())
      .subscribe((lastEditedSite: Site) => {
        this.site = lastEditedSite;
        const siteUrlFilled = this.assetHelpers.redirectIfNameNotFilled(lastEditedSite);

        if (!siteUrlFilled) {
          this.changesSaved = true;
          return;
        }
        const filtering = lastEditedSite.filteringArray;
        this.addedItems = [...filtering.requires];
        this.showRequiresSection = this.addedItems.length > 0;
        this.excludedItems = [...filtering.excludes];

        if (this.createSiteMode) {
          this.isCheckedOnlyAcceptedBanners = !!this.route.snapshot.data.siteOptions.acceptBannersManually;
        } else {
          this.isCheckedOnlyAcceptedBanners = lastEditedSite.onlyAcceptedBanners;
        }
        this.isCheckedOnlyDirectDeals = lastEditedSite.onlyDirectDeals;
      });
    this.subscriptions.push(lastSiteSubscription);
  }

  onChangeOnlyAcceptedBanners($event: MatCheckboxChange) {
    if (!$event.checked) {
      this.isCheckedOnlyDirectDeals = false;
    }
  }

  onChangeOnlyDirectDeals($event: MatCheckboxChange) {
    if ($event.checked) {
      this.isCheckedOnlyAcceptedBanners = true;
    }
  }
}
