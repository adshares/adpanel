import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { animate, style, transition, trigger } from '@angular/animations';
import { AppState } from 'models/app-state.model';
import { appSettings } from 'app-settings';
import { SessionService } from '../../../session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseListComponent } from 'admin/users/base-list/base-list.component';
import { LoadUsers } from 'store/admin/admin.actions';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export interface UsersQueryParams {
  selectedType: 'Advertisers' | 'Publishers' | 'All';
  userSearch: string | null;
  sort?: string[];
  order?: 'desc' | 'asc';
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [style({ opacity: 0 }), animate('400ms', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), animate('400ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class UserListComponent extends BaseListComponent implements OnInit {
  readonly defaultParams: UsersQueryParams = {
    selectedType: 'All',
    userSearch: null,
  };
  localStorageName = 'usersQueryParams';
  userTypes: string[] = appSettings.USER_TYPES;
  faSearch = faSearch;

  constructor(store: Store<AppState>, router: Router, activatedRoute: ActivatedRoute, private session: SessionService) {
    super(store, router, activatedRoute);
  }

  loadList(nextPage?: string): void {
    this.isLoading = true;
    const filters = [];
    this.page = 1;
    if (this.queryParams.selectedType) {
      filters.push(this.queryParams.selectedType.toLowerCase());
    }
    this.store.dispatch(
      new LoadUsers({
        nextPage,
        searchPhrase: this.queryParams.userSearch ? this.queryParams.userSearch.toLowerCase().trim() : null,
        filters,
        orderBy: this.queryParams.sort,
        direction: this.queryParams.order,
      })
    );
  }

  get defaultQueryParams(): object {
    return this.defaultParams;
  }

  ngOnInit() {
    const usersSubscription = this.store.select('state', 'admin', 'users').subscribe(users => {
      this.list = users;
      this.isLoading = !this.list;
    });
    this.subscriptions.push(usersSubscription);
    this.queryParams = {
      ...this.defaultParams,
      sort: this.sortKeys[0] || null,
      order: this.sortDesc ? 'desc' : 'asc',
    };
    this.subscriptions.push(this.checkQueryParams());
    this.loadList();
  }

  get showActions(): boolean {
    return this.session.isModerator();
  }
}
