import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/take';

import { fadeAnimation } from '../../common/animations/fade.animation';
import { AppState } from '../../models/app-state.model';
import * as publisherActions from '../../store/publisher/publisher.actions';
import { parseTargetingOtionsToArray } from '../../common/components/targeting/targeting.helpers';
import { Site } from '../../models/site.model';

@Component({
  selector: 'app-edit-site',
  templateUrl: './edit-site.component.html',
  styleUrls: ['./edit-site.component.scss'],
  animations: [fadeAnimation]
})
export class EditSiteComponent implements OnInit {
  getRouterOutletState = (outlet) => outlet.isActivated ? outlet.activatedRoute : '';

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.store.select('state', 'publisher', 'lastEditedSite')
      .take(1)
      .subscribe((lastEditedSite: Site) => {
        if (!lastEditedSite.targetingArray) {
          const targetingOtions = this.route.snapshot.data.targetingOptions;

          this.store.dispatch(
            new publisherActions.SaveSiteTargeting(
              parseTargetingOtionsToArray(lastEditedSite.targeting, targetingOtions)
            )
          );
        }
      });
  }
}
