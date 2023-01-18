import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import { ActivatedRoute, Router } from '@angular/router';
import { sortArrayByKeys } from 'common/utilities/helpers';
import { Subscription } from 'rxjs';
import { TableSortEvent } from 'models/table.model';
import { take } from 'rxjs/operators';

export abstract class BaseListComponent extends HandleSubscriptionComponent {
  private _list;
  private _filteredList;
  private _queryParams;
  private _isLoading: boolean = true;
  private _page = 1;
  private _pageSize = 15;

  protected defaultParams;
  protected localStorageName: string;
  protected sortKeys = [];
  protected sortDesc = false;

  abstract loadList(nextPage?): void;
  abstract get defaultQueryParams(): object;

  protected constructor(
    protected store: Store<AppState>,
    protected router: Router,
    protected activatedRoute: ActivatedRoute
  ) {
    super();
  }

  get list() {
    return this._list;
  }

  get filteredList() {
    return this._filteredList;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get page(): number {
    return this._page;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  get queryParams() {
    return this._queryParams;
  }

  get total(): number {
    return this._list?.total || 0;
  }

  set list(value) {
    this._list = value;
  }

  set filteredList(value) {
    this._filteredList = value;
  }

  set isLoading(value: boolean) {
    this._isLoading = value;
  }

  set page(value: number) {
    this._page = value;
  }

  set pageSize(value: number) {
    this._pageSize = value;
  }

  set queryParams(value) {
    this._queryParams = value;
  }

  onParamChange(name: string, value: string | boolean): void {
    this._queryParams = {
      ...this._queryParams,
      [name]: value,
    };
    this.changeQueryParams();
    this.loadList();
  }

  onPageChange(): void {
    if (this._list && this._list.data) {
      this._filteredList = sortArrayByKeys(this._list.data, this.sortKeys, this.sortDesc);
      this._filteredList = this._filteredList.slice((this._page - 1) * this._pageSize, this._page * this._pageSize);
    } else {
      this._filteredList = [];
    }
  }

  sortTable(event: TableSortEvent, paginationHandledByServer = false): void {
    this.sortKeys = event.keys;
    this.sortDesc = event.sortDesc;
    this._queryParams = {
      ...this._queryParams,
      sort: this.sortKeys[0],
      order: this.sortDesc ? 'desc' : 'asc',
    };
    this.changeQueryParams();
    paginationHandledByServer ? this.loadList() : this.onPageChange();
  }

  handlePaginationEvent(e, paginationHandledByServer = false): void {
    if (paginationHandledByServer) {
      const nextPage =
        this._list.prevPageUrl && this._list.currentPage >= e.pageIndex + 1
          ? this._list.prevPageUrl
          : this._list.nextPageUrl;
      this.loadList(nextPage);
      return;
    }
    this._page = e.pageIndex + 1;
    this.onPageChange();
  }

  changeQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        ...this._queryParams,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
    localStorage.setItem(this.localStorageName, JSON.stringify(this._queryParams));
  }

  checkQueryParams(): Subscription {
    return this.activatedRoute.queryParams.pipe(take(1)).subscribe(param => {
      for (let key in this._queryParams) {
        if (!param[key]) continue;
        let newParam = param[key];
        if (newParam === 'true') {
          newParam = true;
        } else if (newParam === 'false') {
          newParam = false;
        }
        this._queryParams = {
          ...this._queryParams,
          [key]: newParam,
        };
      }
    });
  }

  onResetButtonClick(): void {
    const defParams = this.defaultQueryParams;
    this._queryParams = {
      ...defParams,
    };
    this.changeQueryParams();
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      replaceUrl: true,
    });
    localStorage.removeItem(this.localStorageName);
    this.loadList();
  }
}
