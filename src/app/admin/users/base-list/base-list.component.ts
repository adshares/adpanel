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

  abstract loadList (): void
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

  sortTable(event: TableSortEvent): void {
    this.sortKeys = event.keys;
    this.sortDesc = event.sortDesc;
    this.queryParams = {
      ...this.queryParams,
      sort: this.sortKeys[0],
      order: this.sortDesc ? 'desc' : 'asc',
    }
    this.changeQueryParams();
    this.onPageChange();
  }

  handlePaginationEvent(e): void {
    this.page = e.pageIndex + 1;
    this.onPageChange();
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



// ngOnInit () {
//   console.log(this.queryParams)
//   // this.subscriptions.push(this.checkQueryParams())
//
// }

// sortTable (event: TableSortEvent) {
//   this.sortKeys = event.keys
//   this.sortDesc = event.sortDesc
//   this.changeQueryParams()
//   this.loadUsers()
// }

// handlePaginationEvent (e): void {
//   const payload = this.users.prevPageUrl && this.users.currentPage >=
//   e.pageIndex + 1 ? this.users.prevPageUrl
//     : this.users.nextPageUrl
//   this.loadUsers(payload)
// }

// @Component({
//   selector: 'app-base-list',
//   template: '',
//   animations: [
//     trigger(
//       'fadeIn',
//       [
//         transition(
//           ':enter', [
//             style({opacity: 0}),
//             animate('400ms', style({'opacity': 1}))
//           ]
//         ),
//         transition(
//           ':leave', [
//             style({opacity: 1}),
//             animate('400ms', style({'opacity': 0}))
//           ]
//         )]
//     )
//   ],
// })


//
// groupAdvertisers(groupBy): void {
//   this.filtersParams = {
//     ...this.filtersParams,
//     groupBy: groupBy
//   };
//   this.queryParams = {
//     ...this.queryParams,
//     groupBy: groupBy === 'campaign' ? null : groupBy
//   }
//   this.changeQueryParams();
//   this.loadList();
// }


// if(typeof this.filtersParams[key] !== 'undefined' && this.queryParams[key]) {
//   this.filtersParams[key] = this.queryParams[key]
// }


// groupList(groupBy): void {
//   this.queryParams = {
//     ...this.queryParams,
//     groupBy: groupBy
//   };
//   // this.queryParams = {
//   //   ...this.queryParams,
//   //   groupBy: groupBy === this.defaultParams.groupBy ? null : groupBy
//   // }
//   this.changeQueryParams();
//   this.loadList();
// }
//
// changeInterval(interval): void {
//   this.queryParams = {
//     ...this.queryParams,
//     interval: interval
//   };
//   // this.queryParams = {
//   //   ...this.queryParams,
//   //   interval: interval === this.defaultParams.interval ? null : interval
//   // }
//   this.changeQueryParams();
//   this.loadList();
// }
//
// onSearchChange(): void {
//   this.queryParams = {
//     ...this.queryParams,
//     searchPhrase: this.queryParams.searchPhrase
//   }
//   this.changeQueryParams();
//   this.loadList();
// }
//
// onMinDailyViewsChange(): void {
//   this.queryParams = {
//     ...this.queryParams,
//     minDailyViews: this.queryParams.minDailyViews
//   }
//   this.changeQueryParams();
//   this.loadList();
// }
