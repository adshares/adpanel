import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { animate, style, transition, trigger } from '@angular/animations';
import { AppState } from 'models/app-state.model';
import { LoadAdvertisers } from 'store/admin/admin.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseListComponent } from 'admin/users/base-list/base-list.component';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export interface AdvertisersQueryParams {
  searchPhrase: string | null;
  groupBy: 'campaign' | 'user';
  interval: 'week' | 'day' | 'hour';
  minDailyViews: number;
  sort?: string[];
  order?: 'desc' | 'asc';
}

@Component({
  selector: 'app-advertiser-list',
  templateUrl: './advertiser-list.component.html',
  styleUrls: ['./advertiser-list.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [style({ opacity: 0 }), animate('400ms', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), animate('400ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class AdvertiserListComponent extends BaseListComponent implements OnInit {
  readonly defaultParams: AdvertisersQueryParams = {
    searchPhrase: '',
    groupBy: 'campaign',
    interval: 'week',
    minDailyViews: 10000,
  };
  localStorageName = 'advertisersQueryParams';
  faSearch = faSearch;

  constructor(store: Store<AppState>, router: Router, activatedRoute: ActivatedRoute) {
    super(store, router, activatedRoute);
  }

  loadList(): void {
    this.isLoading = true;
    this.page = 1;
    this.store.dispatch(
      new LoadAdvertisers({
        ...this.queryParams,
      })
    );
  }

  get defaultQueryParams(): object {
    return this.defaultParams;
  }

  ngOnInit(): void {
    const advertisersSubscription = this.store.select('state', 'admin', 'advertisers').subscribe(advertisers => {
      this.list = advertisers;
      this.isLoading = !this.list;
      this.onPageChange();
    });
    this.subscriptions.push(advertisersSubscription);
    this.queryParams = {
      ...this.defaultParams,
      sort: this.sortKeys[0] || null,
      order: this.sortDesc ? 'desc' : 'asc',
    };
    this.subscriptions.push(this.checkQueryParams());
    this.loadList();
  }
}
