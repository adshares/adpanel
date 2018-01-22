import { Component, OnInit } from '@angular/core';
import { HandleSubscription } from '../../common/handle-subscription';
import * as adminActions from '../../store/admin/admin.action';
import { Store } from '@ngrx/store';
import { AppState } from '../../models/app-state.model';
import { UserInfoStats } from '../../models/settings.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent extends HandleSubscription implements OnInit {
  users: UserInfoStats[];
  userCount: number;
  userTypes = ['Advertisers', 'Publishers', 'All'];
  filteredUsersByType: UserInfoStats[];

  constructor(private store: Store<AppState>) {
    super(null);

    const usersSubscription = store.select('state', 'admin', 'users')
      .subscribe(users => {
        this.users = users;
        this.filteredUsersByType = users;
        this.userCount = this.users.length;
      });

    this.subscriptions.push(usersSubscription);
  }

  ngOnInit() {
    this.store.dispatch(new adminActions.LoadUsers(''));
    this.store.dispatch(new adminActions.LoadAdminSettings(''));
  }

  filterUsersByType(type) {
    this.filteredUsersByType = this.users.filter(user => {
      if (type === 'All') {
        return true;
      } else if (user.isAdvertiser && !user.isPublisher && type === 'Advertisers') {
        return true;
      } else if (!user.isAdvertiser && user.isPublisher && type === 'Publishers') {
        return true;
      }
    })

    return this.filteredUsersByType;
  }
}
