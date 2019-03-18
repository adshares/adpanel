import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { HandleSubscription } from 'common/handle-subscription';
import { AppState } from 'models/app-state.model';
import { UserInfoStats } from 'models/settings.model';
import { sortArrayByColumnMetaData } from 'common/utilities/helpers';
import { TableColumnMetaData } from 'models/table.model';
import * as adminActions from 'store/admin/admin.actions';
import { appSettings } from 'app-settings';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent extends HandleSubscription implements OnInit {
  userSearch = '';
  users: UserInfoStats[];
  filteredUsers: UserInfoStats[];

  userCount: number;
  userTypes = appSettings.USER_TYPES;
  selectedType = 'All';

  constructor(private store: Store<AppState>) {
    super();
  }

  ngOnInit() {
    const usersSubscription = this.store.select('state', 'admin', 'users')
      .subscribe(users => {
        this.users = users;
        this.filteredUsers = [...users];
        this.userCount = this.users.length;
      });
    this.subscriptions.push(usersSubscription);

    this.store.dispatch(new adminActions.LoadUsers(''));
    this.store.dispatch(new adminActions.LoadAdminSettings());
  }

  filterUsersByType(type, resetSearch = false) {
    this.selectedType = type;

    if (resetSearch) {
      this.userSearch = '';
    }

    this.filteredUsers = this.users.filter(user => {
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
}
