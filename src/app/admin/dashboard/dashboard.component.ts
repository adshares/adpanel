import { Component, OnInit } from '@angular/core';
import { AppState } from "models/app-state.model";
import * as adminActions from "store/admin/admin.actions";
import { Store } from "@ngrx/store";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {
  settings = [
    {
      title: 'Account Settings',
      description: '',
      link: '/admin/dashboard/account',
      values: [
        {name: 'Email & Password', icon: 'assets/images/preferences.svg'},
      ],
    },
    {
      title: 'Earnings Settings',
      description: '',
      link: '/admin/dashboard/earnings',
      values: [
        {name: 'Set your earnings', icon: 'assets/images/wallet--gray.svg'},
      ],
    }, {
      title: 'Params Settings',
      description: '',
      link: '/admin/dashboard/general',
      values: [
        {name: 'Set your params', icon: 'assets/images/preferences.svg'},
      ],
    }
  ];

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(new adminActions.LoadAdminSettings());
  }
}

