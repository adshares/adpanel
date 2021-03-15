import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { animate, style, transition, trigger, } from '@angular/animations';
import { HandleSubscription } from 'common/handle-subscription';
import { AppState } from 'models/app-state.model';
import { Advertisers, AdvertiserInfo } from 'models/settings.model';
import { sortArrayByKeys } from 'common/utilities/helpers';
import { TableSortEvent } from 'models/table.model';
import { LoadAdvertisers } from 'store/admin/admin.actions';

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
export class AdvertiserListComponent extends HandleSubscription implements OnInit {
  advertisers: Advertisers;
  filteredAdvertisers: AdvertiserInfo[];
  searchPhrase = '';
  groupBy = 'campaign';
  interval = 'week';
  minDailyViews = 10000;
  isLoading: boolean = true;

  pageSize = 15;
  page = 1;
  sortKeys = [];
  sortDesc = false;

  constructor(private store: Store<AppState>) {
    super();
  }

  ngOnInit(): void {
    const advertisersSubscription = this.store.select('state', 'admin', 'advertisers')
      .subscribe(advertisers => {
        this.advertisers = advertisers;
        this.isLoading = !this.advertisers;
        this.filterAdvertisers();
      });
    this.subscriptions.push(advertisersSubscription);
    this.loadAdvertisers();
  }

  loadAdvertisers(): void {
    this.isLoading = true;
    this.page = 1;
    this.store.dispatch(new LoadAdvertisers({
      groupBy: this.groupBy,
      interval: this.interval,
      searchPhrase: this.searchPhrase.toLowerCase().trim(),
      minDailyViews: this.minDailyViews,
    }));
  }

  groupAdvertisers(groupBy): void {
    this.groupBy = groupBy;
    this.loadAdvertisers();
  }

  changeInterval(interval): void {
    this.interval = interval;
    this.loadAdvertisers();
  }

  onSearchChange(): void {
    this.loadAdvertisers();
  }

  onMinDailyViewsChange(): void {
    this.loadAdvertisers();
  }

  filterAdvertisers(): void {
    if (this.advertisers && this.advertisers.data) {
      this.filteredAdvertisers = sortArrayByKeys(this.advertisers.data, this.sortKeys, this.sortDesc);
      this.filteredAdvertisers = this.filteredAdvertisers.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
    } else {
      this.filteredAdvertisers = [];
    }
  }

  sortTable(event: TableSortEvent): void {
    this.sortKeys = event.keys;
    this.sortDesc = event.sortDesc;
    this.filterAdvertisers();
  }

  handlePaginationEvent(e): void {
    this.page = e.pageIndex + 1;
    this.filterAdvertisers();
  }
}
