import { Component, OnInit } from '@angular/core';
import { AppState } from 'models/app-state.model';
import { GetLicense, LoadAdminSettings } from 'store/admin/admin.actions';
import { Store } from '@ngrx/store';
import { HandleSubscription } from 'common/handle-subscription';
import { AdminIndexUpdateTimeResponse, License } from 'models/settings.model';
import * as moment from 'moment';
import { AdminService } from 'admin/admin.service';
import { DATE_AND_TIME_FORMAT } from 'common/utilities/consts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends HandleSubscription implements OnInit {
  private readonly DAYS_TO_DISPLAY_MESSAGE_AFTER_INDEX_UPDATE = 3;
  showIndexUpdateMessage: boolean = false;
  showIndexUpdateHttpError: boolean = false;
  indexUpdateTime : string|null = null;

  isPanelBlocked: boolean = false;
  licenseDetailUrl: string = null;
  settings = [
    {
      title: 'Users',
      description: '',
      link: '/admin/dashboard/users',
      values: [
        {name: 'Users List', icon: 'assets/images/user-gray.svg'},
        {name: 'Publishers', icon: 'assets/images/user-gray.svg'},
        {name: 'Reports', icon: 'assets/images/user-gray.svg'},
      ],
    },
    {
      title: 'General settings',
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
      title: 'Finance settings',
      description: '',
      link: '/admin/dashboard/finance',
      values: [
        {name: 'Set your commissions', icon: 'assets/images/wallet--gray.svg'},
        {name: 'Wallet status', icon: 'assets/images/wallet--gray.svg'},
        {name: 'Set your thresholds', icon: 'assets/images/wallet--gray.svg'},
      ],
    },
    {
      title: 'Privacy settings',
      description: '',
      link: '/admin/dashboard/privacy',
      values: [
        {name: 'Privacy', icon: 'assets/images/preferences.svg'},
        {name: 'Terms and conditions', icon: 'assets/images/preferences.svg'},
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
      title: 'Account settings',
      description: '',
      link: '/admin/dashboard/account',
      values: [
        {name: 'Email & password', icon: 'assets/images/preferences.svg'},
        {name: 'Referrer', icon: 'assets/images/preferences.svg'},
      ],
    },
  ];

  constructor(
    private adminService: AdminService,
    private store: Store<AppState>,
  ) {
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

    this.adminService.getIndexUpdateTime().subscribe(
      (response: AdminIndexUpdateTimeResponse) => {
        if (!response || !response.indexUpdateTime) {
          this.showIndexUpdateHttpError = true;
        }

        const date = moment(response.indexUpdateTime);
        this.indexUpdateTime = date.format(DATE_AND_TIME_FORMAT);
        this.showIndexUpdateMessage = moment().diff(date, 'days', true) < this.DAYS_TO_DISPLAY_MESSAGE_AFTER_INDEX_UPDATE;
        this.showIndexUpdateHttpError = false;
      },
      () => {
        this.showIndexUpdateHttpError = true;
      }
    );

    this.subscriptions.push(adminStoreSettingsSubscription);
  }
}

