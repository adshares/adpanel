import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { animate, style, transition, trigger } from '@angular/animations';
import { AppState } from 'models/app-state.model';
import { LoadPublishers } from 'store/admin/admin.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseListComponent } from 'admin/users/base-list/base-list.component';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export interface PublishersQueryParams {
  searchPhrase: string | null;
  groupBy: 'campaign' | 'user';
  interval: 'week' | 'day' | 'hour';
  minDailyViews: number;
  sort?: string[];
  order?: 'desc' | 'asc';
}

@Component({
  selector: 'app-publisher-list',
  templateUrl: './publisher-list.component.html',
  styleUrls: ['./publisher-list.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [style({ opacity: 0 }), animate('400ms', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), animate('400ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class PublisherListComponent extends BaseListComponent implements OnInit {
  readonly defaultParams: PublishersQueryParams = {
    searchPhrase: '',
    groupBy: 'campaign',
    interval: 'week',
    minDailyViews: 10000,
  };
  localStorageName = 'publishersQueryParams';
  faSearch = faSearch;

  constructor(store: Store<AppState>, router: Router, activatedRoute: ActivatedRoute) {
    super(store, router, activatedRoute);
  }

  loadList(): void {
    this.isLoading = true;
    this.page = 1;
    this.store.dispatch(
      new LoadPublishers({
        ...this.queryParams,
      })
    );
  }

  get defaultQueryParams(): object {
    return this.defaultParams;
  }

  ngOnInit(): void {
    const publishersSubscription = this.store.select('state', 'admin', 'publishers').subscribe(publishers => {
      this.list = publishers;
      this.isLoading = !this.list;
      this.onPageChange();
    });
    this.subscriptions.push(publishersSubscription);
    this.queryParams = {
      ...this.defaultParams,
      sort: this.sortKeys[0] || null,
      order: this.sortDesc ? 'desc' : 'asc',
    };
    this.subscriptions.push(this.checkQueryParams());
    this.loadList();
  }
}
