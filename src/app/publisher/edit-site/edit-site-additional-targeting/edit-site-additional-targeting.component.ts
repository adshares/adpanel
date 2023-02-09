import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import {
  AddSiteToSites,
  ClearLastEditedSite,
  SaveSiteFiltering,
  SaveSiteOnlyAcceptedBanners,
  UpdateSite,
} from 'store/publisher/publisher.actions';
import { AppState } from 'models/app-state.model';
import { TargetingOption, TargetingOptionValue } from 'models/targeting-option.model';
import { cloneDeep } from 'common/utilities/helpers';
import { PublisherService } from 'publisher/publisher.service';
import { AssetHelpersService } from 'common/asset-helpers.service';
import { Site } from 'models/site.model';
import { parseTargetingForBackend } from 'common/components/targeting/targeting.helpers';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { siteStatusEnum } from 'models/enum/site.enum';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

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
  faQuestionCircle = faQuestionCircle;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router,
    private publisherService: PublisherService,
    private assetHelpers: AssetHelpersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.createSiteMode = !!this.router.url.match('/create-site/');
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
    return this.site.medium !== 'metaverse' ? 'create-ad-units' : 'basic-information';
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
    };
  }

  updateSite(): void {
    this.changesSaved = true;
    this.store.dispatch(new UpdateSite(this.siteToSave));
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
        status: siteStatusEnum.DRAFT,
        filteringArray: chosenTargeting,
      };
      this.store.dispatch(new AddSiteToSites(this.site));
    } else {
      this.store.dispatch(new SaveSiteFiltering(chosenTargeting));
      this.store.dispatch(new SaveSiteOnlyAcceptedBanners(this.isCheckedOnlyAcceptedBanners));
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
      });
    this.subscriptions.push(lastSiteSubscription);
  }
}
