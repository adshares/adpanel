import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppState } from '../../models/app-state.model';
import { Site } from '../../models/site.model';
import * as publisherActions from '../../store/publisher/publisher.actions';

import { enumToArray } from '../../common/utilities/helpers';
import { chartSeriesEnum } from '../../models/enum/chart-series.enum';

@Component({
  selector: 'app-site-details',
  templateUrl: './site-details.component.html',
  styleUrls: ['./site-details.component.scss'],
})
export class SiteDetailsComponent {
  site: Site;
  chartSeries: string[] = enumToArray(chartSeriesEnum);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.site = this.route.snapshot.data.site;
  }

  navigateToEditSite() {
    this.store.dispatch(new publisherActions.SetLastEditedSite(this.site));
    this.router.navigate(
      ['/publisher', 'create-site', 'summary'],
      { queryParams: { step: 4} }
    );
  }
}
