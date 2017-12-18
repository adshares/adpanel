import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HandleSubscription } from '../../common/handle-subscription';

import { Store } from '@ngrx/store';
import { AppState } from '../../models/app-state.model';
import { Site } from '../../models/site.model';

@Component({
  selector: 'app-site-details',
  templateUrl: './site-details.component.html',
  styleUrls: ['./site-details.component.scss'],
})
export class SiteDetailsComponent extends HandleSubscription implements OnInit {
  sites: Site[];
  site: Site;
  siteId: number;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute
  ) {
    super(null);

    const siteSubscription = store
      .select('state', 'publisher', 'sites')
      .subscribe(sites => {
        this.sites = sites
      });

    this.siteId = this.route.snapshot.params.id;
    this.subscriptions.push(siteSubscription);
  }

  ngOnInit() {
    this.site = this.sites.find(site => site.id === this.siteId);
  }
}
