import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { fadeAnimation } from 'common/animations/fade.animation';
import { AppState } from 'models/app-state.model';
import * as publisherActions from 'store/publisher/publisher.actions';
import { parseTargetingOptionsToArray } from 'common/components/targeting/targeting.helpers';
import { Site } from 'models/site.model';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';

@Component({
  selector: 'app-edit-site',
  templateUrl: './edit-site.component.html',
  styleUrls: ['./edit-site.component.scss'],
  animations: [fadeAnimation],
})
export class EditSiteComponent extends HandleSubscriptionComponent implements OnInit, OnDestroy {
  getRouterOutletState = outlet => (outlet.isActivated ? outlet.activatedRoute : '');
  isEditMode: boolean;

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.isEditMode = !!this.router.url.match('/edit-site/');
    const lastEditedSiteSubscription = this.store
      .select('state', 'publisher', 'lastEditedSite')
      .pipe(take(1))
      .subscribe((lastEditedSite: Site) => {
        const filteringOptions = this.route.snapshot.data.filteringOptions;
        this.store.dispatch(
          new publisherActions.SaveSiteFiltering(
            parseTargetingOptionsToArray(lastEditedSite.filtering, filteringOptions)
          )
        );
      });
    this.subscriptions.push(lastEditedSiteSubscription);
  }

  ngOnDestroy(): void {
    if (this.isEditMode) {
      this.store.dispatch(new publisherActions.ClearLastEditedSite());
    }
  }
}
