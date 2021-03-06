import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { animate, style, transition, trigger, } from '@angular/animations';
import { HandleSubscription } from 'common/handle-subscription';
import { AppState } from 'models/app-state.model';
import { UserInfo, Users } from 'models/settings.model';
import { sortArrayByKeys } from 'common/utilities/helpers';
import { TableSortEvent } from 'models/table.model';
import * as adminActions from 'store/admin/admin.actions';
import { appSettings } from 'app-settings';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
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
export class UserListComponent extends HandleSubscription implements OnInit {
  userSearch = '';
  users: Users;
  filteredUsers: UserInfo[];
  userTypes = appSettings.USER_TYPES;
  selectedType = 'All';
  isLoading: boolean = true;

  constructor(private store: Store<AppState>) {
    super();
  }

  ngOnInit() {
    const usersSubscription = this.store.select('state', 'admin', 'users')
      .subscribe(users => {
        this.users = users;
        this.isLoading = !this.users;
        this.filteredUsers = this.users && this.users.data;
      });
    this.subscriptions.push(usersSubscription);

    this.store.dispatch(new adminActions.LoadUsers({}));
  }

  filterUsersByType(type, resetSearch = false) {
    this.selectedType = type;
    if (resetSearch) {
      this.userSearch = '';
      this.store.dispatch(new adminActions.LoadUsers({searchPhrase: ''}));
    }

    this.filteredUsers = this.users.data.filter(user => {
      switch (type) {
        case 'All':
          return true;
        case 'Advertisers':
          return user.isAdvertiser;
        case 'Publishers':
          return user.isPublisher;
      }
    });
  }

  onSearchChange() {
    this.isLoading = true;
    const searchTerm = this.userSearch.toLowerCase().trim();
    this.filterUsersByType('All');
    this.store.dispatch(new adminActions.LoadUsers({searchPhrase: searchTerm}));
  }

  sortTable(event: TableSortEvent) {
    this.filteredUsers = sortArrayByKeys(this.filteredUsers, event.keys, event.sortDesc);
  }

  handlePaginationEvent(e): void {
    const payload = this.users.prevPageUrl && this.users.currentPage >= e.pageIndex + 1 ? this.users.prevPageUrl
      : this.users.nextPageUrl;

    setTimeout(() => {
      this.isLoading = true
    }, 100);
    this.isLoading = false;

    this.store.dispatch(new adminActions.LoadUsers({nextPage: payload}));
  }
}
