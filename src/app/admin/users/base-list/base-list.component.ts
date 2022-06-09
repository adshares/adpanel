import { HandleSubscription } from 'common/handle-subscription'
import { Store } from '@ngrx/store'
import { AppState } from 'models/app-state.model'
import { ActivatedRoute, Router } from '@angular/router'
import { sortArrayByKeys } from 'common/utilities/helpers'
import { Subscription } from 'rxjs'
import { TableSortEvent } from 'models/table.model'
import { take } from 'rxjs/operators'

export abstract class BaseListComponent extends HandleSubscription {
  protected list
  protected filteredList
  protected queryParams
  protected defaultParams
  protected localStorageName: string
  protected isLoading: boolean = true;
  protected page = 1;
  protected pageSize = 15;
  protected sortKeys = [];
  protected sortDesc = false;

  abstract loadList (nextPage?): void
  abstract get defaultQueryParams (): object


  protected constructor(
    private store: Store<AppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super()
  }

  onParamChange(name: string, value: string | boolean): void {
    this.queryParams = {
      ...this.queryParams,
      [name]: value
    };
    this.changeQueryParams();
    this.loadList();
  }

  onPageChange(): void {
    if (this.list && this.list.data) {
      this.filteredList = sortArrayByKeys(this.list.data, this.sortKeys, this.sortDesc);
      this.filteredList = this.filteredList.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
    } else {
      this.filteredList = [];
    }
  }

  sortTable(event: TableSortEvent, responseWithPagination = false): void {
    this.sortKeys = event.keys;
    this.sortDesc = event.sortDesc;
    this.queryParams = {
      ...this.queryParams,
      sort: this.sortKeys[0],
      order: this.sortDesc ? 'desc' : 'asc',
    }
    this.changeQueryParams();
    responseWithPagination ? this.loadList() : this.onPageChange()
  }

  handlePaginationEvent(e, responseWithPagination = false): void {
    if(responseWithPagination){
      const nextPage = this.list.prevPageUrl && this.list.currentPage >=
      e.pageIndex + 1 ? this.list.prevPageUrl
        : this.list.nextPageUrl
      this.loadList(nextPage)
      return
    }
    this.page = e.pageIndex + 1
    this.onPageChange()
  }

  changeQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        ...this.queryParams
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    })
    localStorage.setItem(this.localStorageName, JSON.stringify(this.queryParams))
  }

  checkQueryParams(): Subscription {
    return this.activatedRoute.queryParams.pipe(take(1)).subscribe(param => {
      for(let key in this.queryParams){
        if(!param[key]) continue
        let newParam = param[key]
        if(newParam === 'true'){
          newParam = true
        }
        else if(newParam === 'false'){
          newParam = false
        }
          this.queryParams = {
          ...this.queryParams,
          [key]: newParam
        }
      }
    })
  }

  onResetButtonClick(): void {
    const defParams = this.defaultQueryParams
    this.queryParams = {
      ...defParams
    }
    this.changeQueryParams()
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      replaceUrl: true
    })
    localStorage.removeItem(this.localStorageName)
    this.loadList()
  }
}
