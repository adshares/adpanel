import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { animate, style, transition, trigger, } from '@angular/animations';
import { HandleSubscription } from 'common/handle-subscription';
import { AppState } from 'models/app-state.model';
import { PublisherInfo, Publishers } from 'models/settings.model';
import { sortArrayByKeys } from 'common/utilities/helpers';
import { TableSortEvent } from 'models/table.model';
import * as adminActions from 'store/admin/admin.actions';

@Component({
  selector: 'app-publisher-list',
  templateUrl: './publisher-list.component.html',
  styleUrls: ['./publisher-list.component.scss'],
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
export class PublisherListComponent extends HandleSubscription implements OnInit {
  publishers: Publishers;
  filteredPublishers: PublisherInfo[];
  searchPhrase = '';
  groupBy = 'domain';
  interval = 'week';
  minDailyViews = 1000;
  isLoading: boolean = true;

  pageSize = 15;
  page = 1;
  sortKeys = [];
  sortDesc = false;

  constructor(private store: Store<AppState>) {
    super();
  }

  ngOnInit() {
    const publishersSubscription = this.store.select('state', 'admin', 'publishers')
      .subscribe(publishers => {
        this.publishers = publishers;
        this.isLoading = !this.publishers;
        this.filterPublishers();
      });
    this.subscriptions.push(publishersSubscription);
    this.loadPublishers();
  }

  loadPublishers() {
    this.isLoading = true;
    this.page = 1;
    this.store.dispatch(new adminActions.LoadPublishers({
      groupBy: this.groupBy,
      interval: this.interval,
      searchPhrase: this.searchPhrase.toLowerCase().trim(),
      minDailyViews: this.minDailyViews,
    }));
  }

  groupPublishers(groupBy) {
    this.groupBy = groupBy;
    this.loadPublishers();
  }

  changeInterval(interval) {
    this.interval = interval;
    this.loadPublishers();
  }

  onSearchChange() {
    this.loadPublishers();
  }

  onMinDailyViewsChange() {
    this.loadPublishers();
  }

  filterPublishers() {
    if (this.publishers && this.publishers.data) {
      this.filteredPublishers = sortArrayByKeys(this.publishers.data, this.sortKeys, this.sortDesc);
      this.filteredPublishers = this.filteredPublishers.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
    } else {
      this.filteredPublishers = [];
    }
  }

  sortTable(event: TableSortEvent) {
    this.sortKeys = event.keys;
    this.sortDesc = event.sortDesc;
    this.filterPublishers();
  }

  handlePaginationEvent(e): void {
    this.page = e.pageIndex + 1;
    this.filterPublishers();
  }
}
