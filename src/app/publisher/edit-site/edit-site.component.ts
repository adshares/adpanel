import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/take';

import { fadeAnimation } from 'common/animations/fade.animation';
import { AppState } from 'models/app-state.model';
import * as publisherActions from 'store/publisher/publisher.actions';
import { parseTargetingOptionsToArray } from 'common/components/targeting/targeting.helpers';
import { Site } from 'models/site.model';
import { AssetTargeting } from 'models/targeting-option.model';
import { HandleSubscription } from "common/handle-subscription";

@Component({
  selector: 'app-edit-site',
  templateUrl: './edit-site.component.html',
  styleUrls: ['./edit-site.component.scss'],
  animations: [fadeAnimation]
})
export class EditSiteComponent extends HandleSubscription implements OnInit, OnDestroy {
  getRouterOutletState = (outlet) => outlet.isActivated ? outlet.activatedRoute : '';
  isEditMode: boolean;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super();
  }

  ngOnInit() {
    this.isEditMode = !!this.router.url.match('/edit-site/');
    const lastEditedSiteSubscription = this.store.select('state', 'publisher', 'lastEditedSite')
      .take(1)
      .subscribe((lastEditedSite: Site) => {
        const requires = lastEditedSite.filtering.requires || [];
        const excludes = lastEditedSite.filtering.excludes || [];
        if (!lastEditedSite.filteringArray && !Array.isArray(excludes) ||
          !Array.isArray(requires)) {
          const filteringOptions = this.route.snapshot.data.filteringOptions;
          this.store.dispatch(
            new publisherActions.SaveSiteFiltering(
              parseTargetingOptionsToArray({requires, excludes}, filteringOptions)
            )
          );
        } else {
          const filtering = {
            requires,
            excludes,
          } as AssetTargeting;
          this.store.dispatch(
            new publisherActions.SaveSiteFiltering(filtering)
          )
        }
      });
    this.subscriptions.push(lastEditedSiteSubscription);
  }

  ngOnDestroy() {
    if (this.isEditMode) {
      this.store.dispatch(new publisherActions.ClearLastEditedSite())
    }
  }
}
