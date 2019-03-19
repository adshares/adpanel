import { Component, OnInit } from '@angular/core';
import { AppState } from "models/app-state.model";
import { LoadAdminSettings } from "store/admin/admin.actions";
import { Store } from "@ngrx/store";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

})

export class DashboardComponent implements OnInit {
  settings = [
    {
      title: 'General Settings',
      description: '',
      link: '/admin/dashboard/general',
      values: [
        {name: 'Set business name', icon: 'assets/images/preferences.svg'},
        {name: 'Set technical email', icon: 'assets/images/preferences.svg'},
        {name: 'Set support email', icon: 'assets/images/preferences.svg'},
      ],
    },
    {
      title: 'Earnings Settings',
      description: '',
      link: '/admin/dashboard/earnings',
      values: [
        {name: 'Set your commissions', icon: 'assets/images/wallet--gray.svg'},
        {name: 'Set your thresholds', icon: 'assets/images/wallet--gray.svg'},
      ],
    },
    {
      title: 'Account Settings',
      description: '',
      link: '/admin/dashboard/account',
      values: [
        {name: 'Email & Password', icon: 'assets/images/preferences.svg'},
      ],
    },
  ];

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
    this.store.dispatch(new LoadAdminSettings());
  }
}

