import { Component, OnInit } from '@angular/core';
import { AppState } from "models/app-state.model";
import { GetLicense, LoadAdminSettings } from "store/admin/admin.actions";
import { Store } from "@ngrx/store";
import { HandleSubscription } from "common/handle-subscription";
import { License } from "models/settings.model";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent extends HandleSubscription implements OnInit {
  isPanelBlocked: boolean = false;
  licenseDetailUrl: string = null;
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
    {
      title: 'Users',
      description: '',
      link: '/admin/dashboard/users',
      values: [
        {name: 'Reports', icon: 'assets/images/user-gray.svg'},
        {name: 'Users List', icon: 'assets/images/user-gray.svg'},
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

    if (this.isPanelBlocked) {
      const licenseSubscription = this.store.select('state', 'admin', 'license')
        .subscribe((license: License) => {
          this.licenseDetailUrl = license.detailsUrl;
        });
      this.subscriptions.push(licenseSubscription);
    }

    this.subscriptions.push(adminStoreSettingsSubscription);
  }
}

