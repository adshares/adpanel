import { Component } from '@angular/core';
import { HandleSubscription } from 'common/handle-subscription';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends HandleSubscription {
  constructor (
    private route: ActivatedRoute
  ) {super()}
  links = [
    {
      label: 'Users',
      path: './all',
    },
    {
      label: 'Publishers',
      path: './publishers',
    },
    {
      label: 'Advertisers',
      path: './advertisers',
    },
  ]
}
