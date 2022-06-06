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
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription } from 'rxjs'

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
  selectedType: string | null = 'All'
  onlyEmailUnconfirmed: boolean = false
  onlyAdminUnconfirmed: boolean = false
  userSearch: string | null = null
  sortKeys: string[] = []
  sortDesc: boolean = false

  constructor (
    private store: Store<AppState>,
    private session: SessionService,
    private router: Router,
    private activatedRoute: ActivatedRoute
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
    this.subscriptions.push(this.checkQueryParams())
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

  filterUsersByType (type) {
    this.selectedType = type
    this.changeQueryParams()
    this.loadUsers()
  }

  filterEmailUnconfirmed () {
    this.onlyEmailUnconfirmed = !this.onlyEmailUnconfirmed;
    this.changeQueryParams()
    this.loadUsers()
  }

  filterAdminUnconfirmed () {
    this.onlyAdminUnconfirmed = !this.onlyAdminUnconfirmed;
    this.changeQueryParams()
    this.loadUsers()
  }

  onSearchChange () {
    this.changeQueryParams()
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

  changeQueryParams(): void {
    const queryParams = {
      selectedType: this.selectedType === 'All' ? null : this.selectedType,
      onlyEmailUnconfirmed: this.onlyEmailUnconfirmed || null,
      onlyAdminUnconfirmed: this.onlyAdminUnconfirmed || null,
      userSearch: this.userSearch || null,
    }
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        ...queryParams
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    })
  }

  checkQueryParams(): Subscription {
    return this.activatedRoute.queryParams.subscribe(param => {
      for(let key in param) {
        if(typeof this[key] !== 'undefined') {
          if(param[key] === 'true' || param[key] === 'false') {
            this[key] = JSON.parse(param[key])
            continue
          }
          this[key] = param[key]
        }
      }
    })
  }

  onResetButtonClick(): void {
    this.selectedType = 'All'
    this.onlyEmailUnconfirmed = false
    this.onlyAdminUnconfirmed = false
    this.userSearch = null
    this.sortKeys = []
    this.sortDesc = false
    this.changeQueryParams()
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      replaceUrl: true
    })
    this.loadUsers()
  }
}
