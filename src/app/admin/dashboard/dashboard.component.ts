import { Component, OnInit } from '@angular/core';
import { AppState } from "models/app-state.model";
import { GetLicense, LoadAdminSettings } from "store/admin/admin.actions";
import { Store } from "@ngrx/store";
import { HandleSubscription } from "common/handle-subscription";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent extends HandleSubscription implements OnInit {
  isPanelBlocked: boolean = false;
  settings = [
    {
      title: 'General Settings',
      description: '',
      link: '/admin/dashboard/general',
      values: [
        {name: 'License', icon: 'assets/images/preferences.svg'},
        {name: 'Set business name', icon: 'assets/images/preferences.svg'},
        {name: 'Set technical email', icon: 'assets/images/preferences.svg'},
        {name: 'Set support email', icon: 'assets/images/preferences.svg'},
      ],
    },
    {
      title: 'Finance Settings',
      description: '',
      link: '/admin/dashboard/finance',
      values: [
        {name: 'Set your commissions', icon: 'assets/images/wallet--gray.svg'},
        {name: 'Set your thresholds', icon: 'assets/images/wallet--gray.svg'},
      ],
    },
    {
      title: 'Privacy Settings',
      description: '',
      link: '/admin/dashboard/privacy',
      values: [
        {name: 'Privacy', icon: 'assets/images/preferences.svg'},
        {name: 'Terms and condition', icon: 'assets/images/preferences.svg'},
      ],
    },
    {
      title: 'Rebranding',
      description: '',
      link: '/admin/dashboard/rebranding',
      values: [
        {name: 'Image assets', icon: 'assets/images/preferences.svg'},
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
    super();
  }

  ngOnInit() {
    this.store.dispatch(new LoadAdminSettings());
    this.store.dispatch(new GetLicense());
    const adminStoreSettingsSubscription = this.store.select('state', 'admin', 'panelBlockade')
      .subscribe((isBlocked: boolean) => {
        this.isPanelBlocked = isBlocked;
      });

    this.subscriptions.push(adminStoreSettingsSubscription);
  }
}

