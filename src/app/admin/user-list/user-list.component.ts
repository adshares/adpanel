import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { trigger, transition, style, animate, } from '@angular/animations';
import { HandleSubscription } from 'common/handle-subscription';
import { AppState } from 'models/app-state.model';
import { UserInfoStats, Users } from 'models/settings.model';
import { sortArrayByColumnMetaData } from 'common/utilities/helpers';
import { TableColumnMetaData } from 'models/table.model';
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
  filteredUsers: UserInfoStats[];
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

    this.store.dispatch(new adminActions.LoadUsers());
  }

  filterUsersByType(type, resetSearch = false) {
    this.selectedType = type;

    if (resetSearch) {
      this.userSearch = '';
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
    const searchTerm = this.userSearch.toLowerCase().trim();

    this.filterUsersByType(this.selectedType);

    if (searchTerm) {
      const pattern = new RegExp(searchTerm, 'i');

      this.filteredUsers = this.filteredUsers.filter((user) =>
        pattern.test(user.email.toLowerCase())
      );
    }
  }

  sortTable(columnMetaData: TableColumnMetaData) {
    this.filteredUsers = sortArrayByColumnMetaData(this.filteredUsers, columnMetaData);
  }

  handlePaginationEvent(e): void {
    const payload = this.users.prevPageUrl && this.users.currentPage >= e.pageIndex + 1 ? this.users.prevPageUrl
      : this.users.nextPageUrl;
    setTimeout(() => {
      this.isLoading = true
    }, 100);
    this.isLoading = false;

    this.store.dispatch(new adminActions.LoadUsers(payload));
  }
}
