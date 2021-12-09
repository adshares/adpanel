import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { animate, style, transition, trigger } from '@angular/animations'
import { HandleSubscription } from 'common/handle-subscription'
import { AppState } from 'models/app-state.model'
import { Users } from 'models/settings.model'
import { TableSortEvent } from 'models/table.model'
import * as adminActions from 'store/admin/admin.actions'
import { appSettings } from 'app-settings'
import { SessionService } from '../../../session.service'

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
            style({ opacity: 0 }),
            animate('400ms', style({ 'opacity': 1 })),
          ],
        ),
        transition(
          ':leave', [
            style({ opacity: 1 }),
            animate('400ms', style({ 'opacity': 0 })),
          ],
        )],
    ),
  ],
})
export class UserListComponent extends HandleSubscription implements OnInit {
  users: Users
  isLoading: boolean = true
  userTypes: string[] = appSettings.USER_TYPES
  selectedType: string = 'All'
  onlyEmailUnconfirmed: boolean = false
  onlyAdminUnconfirmed: boolean = false
  userSearch: string = null
  sortKeys: string[] = []
  sortDesc: boolean = false

  constructor (
    private store: Store<AppState>,
    private session: SessionService
  ) {
    super()
  }

  ngOnInit () {
    const usersSubscription = this.store.select('state', 'admin', 'users').
      subscribe(users => {
        this.users = users
        this.isLoading = !this.users
      })
    this.subscriptions.push(usersSubscription)
    this.loadUsers()
  }

  loadUsers (nextPage ?: string): void {
    this.isLoading = true
    const filters = [];
    if (this.onlyEmailUnconfirmed) {
      filters.push('email-unconfirmed');
    }
    if (this.onlyAdminUnconfirmed) {
      filters.push('admin-unconfirmed');
    }
    if (this.selectedType) {
      filters.push(this.selectedType.toLowerCase());
    }
    this.store.dispatch(new adminActions.LoadUsers({
      nextPage,
      searchPhrase: this.userSearch ? this.userSearch.toLowerCase().trim() : null,
      filters,
      orderBy: this.sortKeys.join(','),
      direction: this.sortDesc ? 'desc' : 'asc',
    }))
  }

  filterUsersByType (type, resetSearch = false) {
    this.selectedType = type
    if (resetSearch) {
      this.userSearch = null
      this.loadUsers()
    }
  }

  filterEmailUnconfirmed () {
    this.onlyEmailUnconfirmed = !this.onlyEmailUnconfirmed;
    this.loadUsers()
  }

  filterAdminUnconfirmed () {
    this.onlyAdminUnconfirmed = !this.onlyAdminUnconfirmed;
    this.loadUsers()
  }

  onSearchChange () {
    this.loadUsers()
  }

  sortTable (event: TableSortEvent) {
    this.sortKeys = event.keys
    this.sortDesc = event.sortDesc
    this.loadUsers()
  }

  get showActions () : boolean {
    return this.session.isModerator()
  }

  handlePaginationEvent (e): void {
    const payload = this.users.prevPageUrl && this.users.currentPage >=
    e.pageIndex + 1 ? this.users.prevPageUrl
      : this.users.nextPageUrl
    this.loadUsers(payload)
  }
}
