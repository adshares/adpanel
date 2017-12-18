import { Component, OnInit } from '@angular/core';
import { HandleSubscription } from '../../common/handle-subscription';

import { Store } from '@ngrx/store';
import { AppState } from '../../models/app-state.model';
import { Site } from '../../models/site.model';

import * as publisherActions from '../../store/publisher/publisher.actions';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.scss']
})
export class SiteListComponent extends HandleSubscription implements OnInit {
  sites: Site[]

  constructor(private store: Store<AppState>) {
    super(null);

    const sitesSubscription = store
      .select('state', 'publisher', 'sites')
      .subscribe(sites => this.sites = sites);

    this.subscriptions.push(sitesSubscription);
  }

  ngOnInit() {
    this.store.dispatch(new publisherActions.LoadSites('sites'));
  }

}
