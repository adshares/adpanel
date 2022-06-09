import { Component } from '@angular/core'
import { HandleSubscription } from 'common/handle-subscription';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends HandleSubscription {
  constructor (
  ) {super()}
  links = [
    {
      label: 'Users',
      path: './all',
      queryParams: JSON.parse(localStorage.getItem('usersQueryParams')),
    },
    {
      label: 'Publishers',
      path: './publishers',
      queryParams: JSON.parse(localStorage.getItem('publishersQueryParams')),
    },
    {
      label: 'Advertisers',
      path: './advertisers',
      queryParams: JSON.parse(localStorage.getItem('advertisersQueryParams')),
    },
  ]

  onTabClick(){
    const localStorageQueryParamsForUsers = JSON.parse(localStorage.getItem('usersQueryParams'))
    const localStorageQueryParamsForPublishers = JSON.parse(localStorage.getItem('publishersQueryParams'))
    const localStorageQueryParamsForAdvertisers = JSON.parse(localStorage.getItem('advertisersQueryParams'))
    this.links.forEach(link => {
      if(link.label === 'Users'){
        link.queryParams = localStorageQueryParamsForUsers
      }
      else if(link.label === 'Publishers'){
        link.queryParams = localStorageQueryParamsForPublishers
      }
      else if(link.label === 'Advertisers'){
        link.queryParams = localStorageQueryParamsForAdvertisers
      }
    })
  }
}
