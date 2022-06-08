import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store';
import { animate, style, transition, trigger, } from '@angular/animations';
import { AppState } from 'models/app-state.model';
import { LoadAdvertisers } from 'store/admin/admin.actions';
import { ActivatedRoute, Router } from '@angular/router'
import {  BaseListComponent } from 'admin/users/base-list/base-list.component'

export interface AdvertisersQueryParams {
  searchPhrase: string | null,
  groupBy: 'campaign' | 'user',
  interval: 'week' | 'day' | 'hour',
  minDailyViews: number,
  sort?: string[],
  order?: 'desc' | 'asc'
}

@Component({
  selector: 'app-advertiser-list',
  templateUrl: './advertiser-list.component.html',
  styleUrls: ['./advertiser-list.component.scss'],
  animations: [
    trigger(
      'fadeIn',
      [
        transition(
          ':enter', [
            style({opacity: 0}),
            animate('400ms', style({'opacity': 1}))
          ]
        ),
        transition(
          ':leave', [
            style({opacity: 1}),
            animate('400ms', style({'opacity': 0}))
          ]
        )]
    )
  ],
})
export class AdvertiserListComponent extends BaseListComponent implements OnInit {
  componentStore: Store<AppState>
  defaultParams: AdvertisersQueryParams = {
    searchPhrase: '',
    groupBy: 'campaign',
    interval: 'week',
    minDailyViews: 10000,
  }
  localStorageName = 'advertisersQueryParams'

  constructor(
    store: Store<AppState>,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(store, router, activatedRoute);
    this.componentStore = store
  }

  loadList(): void {
    this.isLoading = true;
    this.page = 1;
    this.componentStore.dispatch(new LoadAdvertisers({
      ...this.queryParams
    }));
  }

  get defaultQueryParams (): object {
    return this.defaultParams
  }

  ngOnInit(): void {
    const advertisersSubscription = this.componentStore.select('state', 'admin', 'advertisers')
      .subscribe(advertisers => {
        this.list = advertisers;
        this.isLoading = !this.list;
        this.onPageChange();
      });
    this.subscriptions.push(advertisersSubscription);
    this.queryParams = {
      ...this.defaultParams,
      sort: this.sortKeys[0] || null,
      order: this.sortDesc ? 'desc' : 'asc',
    }

    this.subscriptions.push(this.checkQueryParams())
    this.loadList();
  }
}



// loadAdvertisers(): void {
//   this.isLoading = true;
//   this.page = 1;
//   this.store.dispatch(new LoadAdvertisers({
//     groupBy: this.defaultComponentParams.groupBy,
//     interval: this.defaultComponentParams.interval,
//     searchPhrase: this.defaultComponentParams.searchPhrase ? this.defaultComponentParams.searchPhrase.toLowerCase().trim() : null,
//     minDailyViews: this.defaultComponentParams.minDailyViews,
//   }));
// }

// groupAdvertisers(groupBy): void {
//   this.filtersParams.groupBy = groupBy;
//   this.queryParams = {
//     ...this.queryParams,
//     groupBy: groupBy === 'campaign' ? null : groupBy
//   }
//   this.changeQueryParams();
//   this.loadList();
// }

// changeInterval(interval): void {
//   this.filtersParams.interval = interval;
//   this.queryParams = {
//     ...this.queryParams,
//     interval: interval === 'week' ? null : interval
//   }
//   this.changeQueryParams();
//   this.loadList();
// }

// onSearchChange(): void {
//   this.queryParams = {
//     ...this.queryParams,
//     searchPhrase: this.filtersParams.searchPhrase || null
//   }
//   this.changeQueryParams();
//   this.loadList();
// }

// onMinDailyViewsChange(): void {
//   this.queryParams = {
//     ...this.queryParams,
//     minDailyViews: this.filtersParams.minDailyViews === 10000 ? null : this.filtersParams.minDailyViews
//   }
//   this.changeQueryParams();
//   this.loadList();
// }

// filterAdvertisers(): void {
//   if (this.advertisers && this.advertisers.data) {
//     this.filteredAdvertisers = sortArrayByKeys(this.advertisers.data, this.sortKeys, this.sortDesc);
//     this.filteredAdvertisers = this.filteredAdvertisers.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
//   } else {
//     this.filteredAdvertisers = [];
//   }
// }

// sortTable(event: TableSortEvent): void {
//   this.sortKeys = event.keys;
//   this.sortDesc = event.sortDesc;
//   this.queryParams = {
//     ...this.queryParams,
//     sort: this.sortKeys[0],
//     order: this.sortDesc ? 'desc' : 'asc',
//   }
//   this.changeQueryParams();
//   this.filterAdvertisers();
// }

// handlePaginationEvent(e): void {
//   this.page = e.pageIndex + 1;
//   this.filterAdvertisers();
// }
